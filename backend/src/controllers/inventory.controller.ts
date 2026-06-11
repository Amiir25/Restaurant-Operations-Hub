import type { Response } from "express";
import * as itemService from "../services/inventory.service.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts"

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

// ===========
// Create item
// ===========
export const createItem = async (req:AuthRequest, res:Response) => {
    try {
        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

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

// =========
// Get items
// =========
export const getItems = async (req:AuthRequest, res:Response) => {
    try {
        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

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

// ==============
// Get item by Id
// ==============
export const getItemById = async (req:AuthRequest, res:Response) => {
    try {
        const id = req.params.itemId as string;

        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

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

// ===========
// Update item
// ===========
export const updateItem = async (req:AuthRequest, res:Response) => {
    try {
        const id = req.params.itemId as string;
        
        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

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

// ===========
// Delete item
// ===========
export const deleteItem = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.itemId as string;
        
        const restaurantId = getRestaurantId(req, res);
        if (!restaurantId) return;

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