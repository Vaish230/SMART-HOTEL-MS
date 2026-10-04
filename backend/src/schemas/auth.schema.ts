import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    email: z
        .string()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    phone: z
        .string(),
});

export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must be 6 digits"),
});


export const resendOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const verifyResetOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
});