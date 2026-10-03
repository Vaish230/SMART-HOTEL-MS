import type { Request, Response, NextFunction } from "express";
import type { Role } from "../generated/prisma/client.ts";

export const roleMiddleware = (...allowedRoles: Role[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = res.locals.user;

        if (!user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    };
};