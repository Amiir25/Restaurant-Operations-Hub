import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();

// Common middleware
router.use(authMiddleware);

/**
 * @route   POST inventory/create-item
 * @desc    Create a new inventory item
 * @access  Protected
 */
router.post('/create-item', inventoryController.createItem);

/**
 * @route   GET inventory/get-all-items
 * @desc    Retrieve all items in a restaurant
 * @access  Protected
 */
router.get('/get-all-items', inventoryController.getItems);

/**
 * @route   GET inventory/get-item
 * @desc    Retrieve item by id in a restaurant
 * @access  Protected
 */
router.get('/get-item/:itemId', inventoryController.getItemById);

/**
 * @route   PUT inventory/update-item
 * @desc    Update item
 * @access  Protected
 */
router.put('/update-item/:itemId', inventoryController.updateItem);

/**
 * @route   DELETE inventory/delete-item
 * @desc    Delete item
 * @access  Protected
 */
router.delete('/delete-item/:itemId', inventoryController.deleteItem);

export default router
