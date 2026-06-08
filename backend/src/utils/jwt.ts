import Jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums.ts";

interface TokenPayload {
    userId: string;
    restaurantId: string;
    role: Role;
}

// JWT secret
const secret = process.env.JWT_SECRET;

// Generate token
export const generateToken = (payload: TokenPayload): string => {

    if (!secret) {
        throw Error("JWT secret is not configured!");
    }

    return Jwt.sign(payload, secret, { expiresIn: "7d" });
}   

// Verify token
export const verifyToken = (token: string): TokenPayload => {
    if (!secret) {
        throw Error("JWT secret is not configured!");
    }

    return Jwt.verify(token, secret) as TokenPayload;
}