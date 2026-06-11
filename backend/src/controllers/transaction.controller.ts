import type { Response } from "express";
import * as transactionService from "../services/transaction.service.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";

//=======
// Helper
//=======
const getRestaurantId = (req: AuthRequest, res: Response): string | null => {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: Restaurant context missing.",
        });
        return null;
    }
    return restaurantId as string;
}

//===================
// Create Transaction
//===================
export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return

        const result = await transactionService.createTransaction(req.body, restaurantId);

        if (!result.success) {
            // If it failed because the items was not found, 404 is more accurate
            const status = result.message.includes("not found") ? 404 : 400;
            return res.status(status).json(result);
        }

        return res.status(201).json(result);

    } catch (error) {
        console.error("🚨 Create transaction controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

//=====================
// Get all Transactions
//=====================
export const getTransactions = async (req:AuthRequest, res:Response) => {
    try {
        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

        const result = await transactionService.getTransactions(restaurantId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("🚨 Get transactions controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

//======================
// Get transaction by Id
//======================
export const getTransactionById = async (req:AuthRequest, res:Response) => {
    try {
        const id = req.params.tId as string;

        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

        const result = await transactionService.getTransactionById(id, restaurantId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("🚨 Get transaction by Id controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

//===================
// Update transaction
//===================
export const updateTransaction = async (req:AuthRequest, res:Response) => {
    try {
        const id = req.params.tId as string;

        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

        const result = await transactionService.updateTransaction(id, restaurantId, req.body);

        if (!result.success) {
            const status = result.message.includes("not found") ? 404 : 400;
            return res.status(status).json(result);
        }

        return res.status(200).json(result);

    } catch (error: any) {
        console.error("🚨 Update item controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

//===================
// Delete transaction
//===================
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.tId as string;

        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

        const result = await transactionService.deleteTransaction(id, restaurantId);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error: any) {
        console.error("🚨 Delete item controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}