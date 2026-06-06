import type { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/enums.ts";
import { verifyToken } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        restaurantId: string;
        role: Role;
    };
}

// Middleware
export const authMiddleware = (
    req: AuthRequest,
    res:Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required.",
            });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token);
        req.user = payload;

        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        })
    }
}