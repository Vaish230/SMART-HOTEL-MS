import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.ts";
import { createToken } from "../lib/jwt.ts";
import crypto from "crypto";
import { sendOtpEmail } from "./email.service.ts";

const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string
) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            phone,
        },
    });


    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
    };
};

export const login = async (
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswValid) {
        throw new Error("Invalid email or password");
    }


    const otp = generateOtp();


    const otpHash = await bcrypt.hash(otp, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            otpHash,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            otpAttempts: 0,
            otpLastSentAt: new Date(),
        },
    });

    await sendOtpEmail(user.email, otp);

    return {
        message: "OTP sent to your email",
        requiresOtp: true,
    };
};


export const verifyOtp = async (
    email: string,
    otp: string
) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid OTP");
    }

    if (!user.otpHash || !user.otpExpiresAt) {
        throw new Error("OTP not found");
    }

    if (user.otpExpiresAt < new Date()) {
        throw new Error("OTP expired");
    }

    if (user.otpAttempts >= 5) {
        throw new Error("Too many attempts");
    }

    const isValid = await bcrypt.compare(otp, user.otpHash);

    if (!isValid) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpAttempts: {
                    increment: 1,
                },
            },
        });

        throw new Error("Invalid OTP");
    }

    const token = createToken({
        id: user.id,
        role: user.role,
    });

    await prisma.user.update({
        where: { id: user.id },
        data: {
            otpHash: null,
            otpExpiresAt: null,
            otpAttempts: 0,
        },
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
        },
    };
};

export const resendOtp = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.otpLastSentAt) {
        const secondsSinceLastOtp =
            (Date.now() - user.otpLastSentAt.getTime()) / 1000;

        if (secondsSinceLastOtp < 60) {
            throw new Error("Please wait before requesting another OTP");
        }
    }

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(otp, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            otpHash,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            otpAttempts: 0,
            otpLastSentAt: new Date(),
        },
    });

    await sendOtpEmail(user.email, otp);

    return {
        message: "New OTP sent to your email",
    };
};


export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email }, });
    if (!user) {
        throw new Error("User not found");
    }

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(otp, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetOtpHash: otpHash,
            resetOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            resetOtpAttempts: 0,
            resetOtpLastSentAt: new Date(),
        }
    })
    await sendOtpEmail(user.email, otp);

    return {
        message: "Password reset OTP sent to your email",
    };
}


export const verifyResetOtp = async (
    email: string,
    otp: string
) => {
    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
        throw new Error("OTP not found or expired")
    }

    if (user.resetOtpExpiresAt < new Date()) {
        throw new Error("OTP expired")
    }

    if (user.resetOtpAttempts >= 5) {
        throw new Error("Too Many Attempts");
    }

    const isValid = await bcrypt.compare(otp, user.resetOtpHash);

    if (!isValid) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetOtpAttempts: {
                    increment: 1
                }
            }
        })

        throw new Error("Invalid OTP");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetOtpVerified: true,
        },
    });

    return {
        message: "OTP verified successfully",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt
        }
    }
}


export const resetPassword = async (
    email: string,
    newPassword: string
) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.resetOtpVerified) {
        throw new Error("OTP verification required");
    }

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
        throw new Error("OTP not found or expired");
    }

    if (user.resetOtpExpiresAt < new Date()) {
        throw new Error("OTP expired");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            resetOtpHash: null,
            resetOtpExpiresAt: null,
            resetOtpAttempts: 0,
            resetOtpLastSentAt: null,
            resetOtpVerified: false,
        },
    });

    return {
        message: "Password reset successfully",
    };
};