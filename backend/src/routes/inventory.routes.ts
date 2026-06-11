import { Router } from "express";
import * as inventoryController from "../controllers/inventory.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();

// Common middleware
router.use(authMiddleware);

/**
 * @route   POST /api/inventory
 * @desc    Create a new inventory item
 * @access  Protected
 */
router.post('/', inventoryController.createItem);

/**
 * @route   GET /api/inventory
 * @desc    Retrieve all items in a restaurant
 * @access  Protected
 */
router.get('/', inventoryController.getItems);

/**
 * @route   GET /api/inventory/:itemId
 * @desc    Retrieve specific item by id
 * @access  Protected
 */
router.get('/:itemId', inventoryController.getItemById);

/**
 * @route   PUT /api/inventory/:itemId
 * @desc    Update specific item
 * @access  Protected
 */
router.put('/:itemId', inventoryController.updateItem);

/**
 * @route   DELETE /ao/inventory/:itemId
 * @desc    Delete a specific item
 * @access  Protected
 */
router.delete('/:itemId', inventoryController.deleteItem);

export default router
