import type { InventoryTransaction } from "../generated/prisma/client.ts";
import { TransactionType } from "../generated/prisma/enums.ts";
import { prisma } from "../lib/prisma.ts";
import type { ServiceResponse } from "./auth.service.ts";

interface TransactionResponse {
    id: string;
    inventoryItemId: string;
    inventoryItemName: string;
    restaurantId: string;
    type: TransactionType;
    quantity: number;
    notes?: string;
    updatedAt: Date;
}

// Mapper
const toTransactionResponse = (
    item: InventoryTransaction
): TransactionResponse => ({
    id: item.id,
    inventoryItemId: item.inventoryItemId,
    inventoryItemName: item.inventoryItemName,
    restaurantId: item.restaurantId,
    type: item.type,
    quantity: item.quantity,
    notes: item.notes || "",
    updatedAt: item.updatedAt,
})

//===================
// Create Transaction
//===================

interface CreateTransactionInput {
    inventoryItemId: string;
    type: TransactionType;
    quantity: number;
    notes?: string;
}

/**
 * Creates a new inventory transaction
 * @param input - The transaction data
 * @param restaurantId - The id of the restaurant that done the transaction
 * @returns The newly created inventory transaction
 */
export const createTransaction = async (
    input: CreateTransactionInput,
    restaurantId: string
): Promise<ServiceResponse<TransactionResponse>> => {
    try {

        // Fetch item
        const inventoryItem = await prisma.inventoryItem.findFirst({
            where: {
                id: input.inventoryItemId,
            },
            select: {
                name: true,
                currentStock: true,
            },
        });

        if (!inventoryItem) {
            return {
                success: false,
                message: "Unable to create transaction. Target inventory item not found."
            }
        }

        // Check stock level for
        if (
            (input.type !== TransactionType.IN) &&
            (input.quantity > inventoryItem.currentStock)
        ) {
            return {
                success: false,
                message: `Insufficient stock. Requested ${input.quantity} but only ${inventoryItem.currentStock} is available.`
            }
        }

        // Calculate new stock based on transaction type
        const stockAdjustment = input.type === TransactionType.IN
            ? input.quantity
            : -input.quantity
        
        // Perform Atomic database transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Update stock
            await tx.inventoryItem.update({
                where: {
                    id: input.inventoryItemId,
                },
                data: {
                    currentStock: {
                        increment: stockAdjustment
                    },
                },
            });

            // Log the transaction
            return await tx.inventoryTransaction.create({
                data: {
                    inventoryItemId: input.inventoryItemId,
                    inventoryItemName: inventoryItem.name,
                    restaurantId,
                    type: input.type,
                    quantity: input.quantity,
                    notes: input.notes || "",
                },
            });
        });

        return {
            success: true,
            message: "Transaction created successfully.",
            data: toTransactionResponse(transactionResult),
        }

    } catch (error) {
        console.error("🚨 Create transaction error:", error);

        return {
            success: false,
            message: "Unable to create transaction",
        }
    }
}

//=====================
// Get all Transactions
//=====================

/**
 * Retrieves all transactions of a restaurant
 * @param restaurantId - The id of the restaurant that done the transaction
 * @returns All the transactions of the restaurant
 */
export const getTransactions = async (
    restaurantId: string
): Promise<ServiceResponse<TransactionResponse[]>> => {
    try {
        const transactions = await prisma.inventoryTransaction.findMany({
            where: {
                restaurantId,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return {
            success: true,
            message: "Transactions retrieved successfully.",
            data: transactions.map(toTransactionResponse)
        }

    } catch (error) {
        console.error("🚨 Get transactions error:", error);

        return {
            success: false,
            message: "Unable to fetch transactions."
        }
    }
}

//======================
// Get transaction by Id
//======================

/**
 * Retrieves a single transactio by Id
 * @param id - The unique id of the transaction
 * @param restaurantId - The id of the restaurant that done the transaction
 * @returns A single inventory transaction
 */
export const getTransactionById = async (
    id: string,
    restaurantId: string
): Promise<ServiceResponse<TransactionResponse>> => {
    try {
        const transaction = await prisma.inventoryTransaction.findFirst({
            where: {
                id,
                restaurantId,
            },
        });

        if (!transaction) {
            return {
                success: false,
                message: "Transaction not found."
            }
        }

        return {
            success: true,
            message: "Transaction retrieved successfully.",
            data: toTransactionResponse(transaction)
        }

    } catch (error) {
        console.error("🚨 Get transaction by Id error:", error);

        return {
            success: false,
            message: "Unable to fetch transaction by Id",
        }
    }
}

//===================
// Update transaction
//===================

// Exclude fields that shouldn't change manually
type UpdateTransactionInput = Partial<
    Omit<InventoryTransaction, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>
>

export const updateTransaction = async (
    id: string,
    restaurantId: string,
    data: UpdateTransactionInput
): Promise<ServiceResponse<TransactionResponse>> => {
    try {
        const updatedTransaction = await prisma.inventoryTransaction.update({
            where: {
                id,
                restaurantId
            },
            data,
        });

        return {
            success: true,
            message: "Transaction updated successfully.",
            data: toTransactionResponse(updatedTransaction),
        }

    } catch (error: any) {
        // Prisma throws P2025 if the record doesn't exist OR belongs to another restaurant
        if (error.code === "P2025") {
            return {
                success: false,
                message: "Transaction not found or unauthorized."
            };
        }
        console.error("🚨 Update transaction error:", error);

        return {
            success: false,
            message: "Unable to update transaction.",
        }
    }
}

//===================
// Delete transaction
//===================

export const deleteTransaction = async (
    id: string,
    restaurantId: string
): Promise<ServiceResponse<TransactionResponse>> => {
    try {
        await prisma.inventoryTransaction.delete({
            where: {
                id,
                restaurantId,
            },
        });

        return {
            success: true,
            message: "Transaction deleted successfully."
        }

    } catch (error: any) {
        if (error.code === "P2025") {
            return {
                success: false,
                message: "Item with this id not found in the specified restaurant.",
            }
        }

        console.error("🚨 Delete transaction error:", error);

        return {
            success: false,
            message: "Unable to delete transaction."
        }
    }
}