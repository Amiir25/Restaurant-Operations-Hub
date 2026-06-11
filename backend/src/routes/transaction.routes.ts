import { Router } from "express";
import * as transactionController from "../controllers/transaction.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();

// Common middleware
router.use(authMiddleware);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction transaction
 * @access  Protected
 */
router.post('/', transactionController.createTransaction);

/**
 * @route   GET /api/transactions
 * @desc    Retrieve all transactions for the authenticated restaurant
 * @access  Protected
 */
router.get('/', transactionController.getTransactions);

/**
 * @route   GET /api/transactions/:tId
 * @desc    Retrieve a specific transaction by id
 * @access  Protected
 */
router.get('/:tId', transactionController.getTransactionById);

/**
 * @route   PUT /api/transactions/:tId
 * @desc    Update a specific transaction
 * @access  Protected
 */
router.put('/:tId', transactionController.updateTransaction);

/**
 * @route   DELETE /api/transactions/:tId
 * @desc    Delete a specific transaction
 * @access  Protected
 */
router.delete('/:tId', transactionController.deleteTransaction);

export default router
