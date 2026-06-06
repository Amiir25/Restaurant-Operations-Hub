import { Router } from "express";
import * as authController from "../controllers/auth.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import type {  AuthRequest } from "../middleware/auth.middleware.ts";

const router = Router();

/**
 * @route   POST auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post('/login', authController.login);

// 
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
    return res.json({
        success: true,
        data: req.user
    })
});

export default router;