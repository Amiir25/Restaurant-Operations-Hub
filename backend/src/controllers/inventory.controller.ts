import type { Request, Response } from "express";
import * as itemService from "../services/inventory.service.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts"

// Create item controller
export const createItem = async (req:AuthRequest, res:Response) => {
    try {
        const restaurantId = req.user?.restaurantId as string;
        if (!restaurantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Restaurant context missing."
            });
        }

        const result = await itemService.createItem(req.body, restaurantId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);

    } catch (error) {
        console.error("Create item controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Get items controller
export const getItems = async (req:AuthRequest, res:Response) => {
    try {
        const restaurantId = req.user?.restaurantId as string;
        if (!restaurantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Restaurant context missing."
            });
        }

        const result = await itemService.getItems(restaurantId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Get items controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Get item by id controller
export const getItemById = async (req:AuthRequest, res:Response) => {
    try {
        const id = req.params.itemId as string;

        const restaurantId = req.user?.restaurantId as string;
        if (!restaurantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Restaurant context missing."
            });
        }

        const result = await itemService.getItemById(id, restaurantId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Get item by Id controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Update item controller
export const updateItem = async (req:AuthRequest, res:Response) => {
    try {
        const id = req.params.itemId as string;
        const restaurantId = req.user?.restaurantId as string;
        if (!restaurantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Restaurant context missing from session."
            });
        }

        const result = await itemService.updateItem(id, restaurantId, req.body);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error: any) {
        console.error("Update item controller error:", error);

        // Handle the specific item-not-found/unauthorized error from the service
        if (error.message.includes("not found for restaurant")) {
            return res.status(404).json({
                success: false,
                message: error.message
            })
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// Delete item controller
export const deleteItem = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.itemId as string;
        const restaurantId = req.user?.restaurantId as string;
        if (!restaurantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Restaurant context missing from session."
            });
        }

        const result = await itemService.deleteItem(id, restaurantId);
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error: any) {
         console.error("Delete item controller error:", error);

        if (error.message.includes("not found for restaurant")) {
            return res.status(404).json({
                success: false,
                message: error.message
            })
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}