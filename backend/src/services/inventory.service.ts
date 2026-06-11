
import type { InventoryItem } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import type { ServiceResponse } from "./auth.service.ts";

interface InventoryItemResponse {
    id: string;
    name: string;
    category: string;
    unit: string;
    currentStock: number;
    reorderLevel: number;
    isPerishable: boolean;
    expirationDate: Date | null;
    averageCostPerUnit: number;
    supplierId: string | null;
    restaurantId: string;
    createdAt: Date;
}

// Mapper
const toInventoryItemResponse = (
    item: InventoryItem
): InventoryItemResponse => ({
    id: item.id,
    name: item.name,
    category: item.category,
    unit: item.unit,
    currentStock: item.currentStock,
    reorderLevel: item.reorderLevel,
    isPerishable: item.isPerishable,
    expirationDate: item.expirationDate,
    averageCostPerUnit: item.averageCostPerUnit,
    supplierId: item.supplierId,
    restaurantId: item.restaurantId,
    createdAt: item.createdAt,  
});

/**************
 * Create item
 **************/

interface createInventoryItemInput {
    name: string;
    category: string;
    unit: string;
    reorderLevel?: number;
    isPerishable?: boolean;
    expirationDate?: Date;
    averageCostPerUnit?: number;
    supplierId?: string;
}

/**
 * Creates a new inventory item
 * @param input - The data of the item to be created
 * @param restaurantId - The id of the restaurant that owns the items
 * @returns - The newly created inventory item
 */
export const createItem = async (
    input: createInventoryItemInput,
    restaurantId: string
): Promise<ServiceResponse<InventoryItemResponse>> => {
    try {

        // Create item
        const item = await prisma.inventoryItem.create({
            data: {
                name: input.name,
                category: input.category,
                unit: input.unit,
                reorderLevel: input.reorderLevel ?? 0,
                isPerishable: input.isPerishable ?? false,
                expirationDate: input.expirationDate,
                averageCostPerUnit: input.averageCostPerUnit,
                supplierId: input.supplierId,
                restaurantId,
            },
        });

        return {
            success: true,
            message: "Inventory item created successfully",
            data: toInventoryItemResponse(item),
        }

    } catch (error) {
        console.error("🚨 Create inventory item error:", error);

        return {
            success: false,
            message: "Unable to create inventory item."
        }
    }
}

/*****************
 * Get all items
 ****************/

/**
 * Retrieves all the items in a restaurant
 * @param restaurantId - The id of the restaurant that owns the items
 * @returns All the inventory items in the restaurant
 */
export const getItems = async (
    restaurantId: string
): Promise<ServiceResponse<InventoryItemResponse[]>> => {
    try {
        const items = await prisma.inventoryItem.findMany({
            where: {
                restaurantId,
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return {
            success: true,
            message: "Inventory items retrieved successfully.",
            data: items.map(toInventoryItemResponse),
        };

    } catch (error) {
        console.error("🚨 Get inventory items error:", error);

        return {
            success: false,
            message: "Unable to retrieve inventory items."
        }
    }
}

/*****************
 * Get single item
 ****************/

/**
 * Retrieves single item by Id
 * @param id - The unique CUID of inventory item
 * @param restaurantId  -The id of the restaurant that owns the item
 * @returns A single inventory item
 */
export const getItemById = async (
    id: string,
    restaurantId: string,
): Promise<ServiceResponse<InventoryItemResponse>> => {
    try {
        const item = await prisma.inventoryItem.findFirst({
            where: {
                id,
                restaurantId
            },
        });

        if (!item) {
            return {
                success: false,
                message: "Inventory item not found.",
            }
        }

        return {
            success: true,
            message: "Inventory item retrieved successfully.",
            data: toInventoryItemResponse(item),
        }

    } catch (error) {
        console.error("🚨 Get inventory item error:", error);

        return {
            success: false,
            message: "Unable to retrieve inventory item."
        }
    }
}

/*************
 * Update item
 ************/

// Exclude fields that shouldn't change manually
export type UpdateInventoryItemInput = Partial<
    Omit<InventoryItem, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>
>;

/**
 * Updates an existing inventory item
 * @param id - The unique CUID of the inventory item
 * @param restaurantId - The id of the restaurant that owns the item
 * @param data - The partial fields to update
 * @returns The updated InventoryItem object
 */
export const updateItem = async (
    id: string,
    restaurantId: string,
    data: UpdateInventoryItemInput,
): Promise<ServiceResponse<InventoryItemResponse>> => {
    try {
        const updatedItem = await prisma.inventoryItem.update({
            where: {
                id,
                restaurantId,
            },
            data,
        });

        return {
            success: true,
            message: "Item updated successfully.",
            data: toInventoryItemResponse(updatedItem)
        }

    } catch (error: any) {

        // Prisma error code P2025 means the record was not found under the specified criteria
        if (error.code === "P2025") {
            return {
                success: false,
                message: "🚨 Item with this Id not found in the specified restaurant.",
            }
        }

        console.error("🚨 Update inventory item error:", error);

        return {
            success: false,
            message: "Unable to update inventory item.",
        }
    }
}

/*************
 * Delete item
 ************/

/**
 * Deletes inventory item
 * @param id - The id of the inventory item to be deleted
 * @param restaurantId - The id of the restaurant that owns the item
 * @returns A success message
 */
export const deleteItem = async (
    id: string,
    restaurantId: string,
): Promise<ServiceResponse<InventoryItemResponse>> => {
    try {
        await prisma.inventoryItem.delete({
            where: {
                id,
                restaurantId,
            },
        });

        return {
            success: true,
            message: "Item deleted successfully."
        }

    } catch (error: any) {
        if (error.code === "P2025") {
            return {
                success: false,
                message: "🚨 Item with this id not found in the specified restaurant.",
            }
        }

        console.error("🚨 Delete inventory item error:", error);

        return {
            success: false,
            message: "Unable to delete inventory item."
        }
    }
}