const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/user/cart.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/cart
 * @desc Get cart items for the current user
 * @access Private
 */
router.get("/", verifyToken, cartController.getMyCartItems);

/**
 * @route GET /api/user/cart/family/:familyId
 * @desc Get cart items by family ID
 * @param {Number} familyId - Family ID
 * @access Private
 */
router.get(
    "/family/:familyId",
    verifyToken,
    cartController.getCartItemsByFamilyId
);

/**
 * @route POST /api/user/cart/assign
 * @desc Assign ingredients to family members from meal plans
 * @access Private
 */
router.post(
    "/assign",
    verifyToken,
    cartController.assignIngredientsToFamilyMembers
);

/**
 * @route PATCH /api/user/cart/:id/status
 * @desc Update cart item status
 * @param {Number} id - Cart item ID
 * @access Private
 */
router.patch("/:id/status", verifyToken, cartController.updateCartItemStatus);

module.exports = router;
