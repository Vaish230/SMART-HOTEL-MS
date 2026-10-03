import type { Request, Response } from "express";
import { signupSchema, loginSchema, verifyOtpSchema, resendOtpSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.services";

export const signupController = async (
    req: Request,
    res: Response
) => {
    try {
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten(),
            });
        }

        const { name, email, password, phone } = result.data;

        const user = await authService.signup(
            name,
            email,
            password,
            phone
        );

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error("Signup error:", error);

        if (
            error instanceof Error &&
            error.message === "User already exists"
        ) {
            return res.status(409).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const loginController = async (
    req: Request,
    res: Response
) => {
    otpLastSentAt: new Date(),
        console.log("LOGIN BODY:", req.body);
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten(),
            });
        }

        const { email, password } = result.data;

        const resultData = await authService.login(
            email,
            password
        );

        res.cookie("token", resultData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: resultData.user,
        });
    } catch (error) {
        console.error("Login error:", error);

        if (
            error instanceof Error &&
            error.message === "Invalid email or password"
        ) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


export const logoutController = async (
    req: Request,
    res: Response
) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json({
        message: "User logged out successfully",
    });
};


export const verifyOtpController = async (
    req: Request,
    res: Response
) => {
    try {
        const result = verifyOtpSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten(),
            });
        }

        const { email, otp } = result.data;

        const resultData = await authService.verifyOtp(
            email,
            otp
        );

        res.cookie("token", resultData.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({
            message: "OTP verified successfully",
            user: resultData.user,
        });
    } catch (error) {
        console.error("OTP verification error:", error);

        if (error instanceof Error) {
            return res.status(401).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const resendOtpController = async (
    req: Request,
    res: Response
) => {
    try {
        const result = resendOtpSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten(),
            });
        }

        const { email } = result.data;

        const resultData = await authService.resendOtp(email);

        return res.status(200).json(resultData);

    } catch (error) {


        console.error("Resend OTP error:", error);

        if (
            error instanceof Error &&
            error.message === "Please wait before requesting another OTP"
        ) {
            return res.status(429).json({
                message: error.message,
            });
        }

        if (
            error instanceof Error &&
            error.message === "User not found"
        ) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};