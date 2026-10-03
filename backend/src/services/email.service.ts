import { transporter } from "../config/mailer.ts";

export const sendOtpEmail = async (
    email: string,
    otp: string
) => {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Your Login OTP",
        html: `
            <h2>Hotel Management - Login Verification</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP will expire in 5 minutes.</p>

            <p>Do not share this OTP with anyone.</p>
        `,
    });
};