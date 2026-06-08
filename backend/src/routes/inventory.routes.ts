import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();

/**
 * @route   POST inventory/create-item
 * @desc    Create a new inventory item
 * @access  Protected
 */
router.post('/create-item', authMiddleware, inventoryController.createItem);

/**
 * @route   GET inventory/get-all-items
 * @desc    Retrieve all items in a restaurant
 * @access  Protected
 */
router.get('/get-all-items', authMiddleware, inventoryController.getItems);

/**
 * @route   GET inventory/get-item
 * @desc    Retrieve item by id in a restaurant
 * @access  Protected
 */
router.get('/get-item/:itemId', authMiddleware, inventoryController.getItemById);

/**
 * @route   PUT inventory/update-item
 * @desc    Update item
 * @access  Protected
 */
router.put('/update-item/:itemId', authMiddleware, inventoryController.updateItem);

/**
 * @route   DELETE inventory/delete-item
 * @desc    Delete item
 * @access  Protected
 */
router.delete('/delete-item/:itemId', authMiddleware, inventoryController.deleteItem);

export default router
