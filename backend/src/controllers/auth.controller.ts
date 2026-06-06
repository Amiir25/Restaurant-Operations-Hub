import type { Request, Response } from "express";
import * as authService from "../services/auth.service.ts";

// Register controller
export const register = async (req: Request, res: Response) => {
    try {

        const result = await authService.register(req.body);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);

    } catch (error) {
        console.error("Register controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}

// Login controller
export const login = async (req:Request, res:Response) => {
    try {
        const result = await authService.login(req.body);

        if (!result.success) {
            return res.status(401).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Login controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}