import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.ts";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = verifyToken(token);

        res.locals.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};