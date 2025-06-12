const cartService = require("../../services/user/cart.service");
const fridgeService = require("../../services/user/fridge.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk, responseError } = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

/**
 * Get cart items for the current user
 * @route GET /api/user/cart
 * @param {Number} req.user.id - User ID from token
 * @returns {Array} - List of cart items for the user
 */
exports.getMyCartItems = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cartItems = await cartService.getCartItemsByUserId(userId);
    return responseOk(res, cartItems, "Cart items retrieved successfully");
});

/**
 * Get cart items by family ID
 * @route GET /api/user/cart/family/:familyId
 * @param {Number} req.params.familyId - Family ID
 * @returns {Array} - List of cart items for the family grouped by users
 */
exports.getCartItemsByFamilyId = asyncHandler(async (req, res) => {
    const { familyId } = req.params;

    if (!familyId) {
        throw new ApiError(400, "Family ID is required");
    }

    const cartItems = await cartService.getCartItemsByFamilyId(familyId);
    return responseOk(res, cartItems, "Cart items retrieved successfully");
});

/**
 * Assign ingredients to family members from meal plans
 * @route POST /api/user/cart/assign
 * @param {Number} req.body.familyId - Family ID
 * @param {Array} req.body.mealPlanIds - Array of meal plan IDs to include in assignments
 * @param {Array} req.body.memberIds - Array of user IDs to assign ingredients to
 * @returns {Object} - Assigned cart items grouped by users
 */
exports.assignIngredientsToFamilyMembers = asyncHandler(async (req, res) => {
    const { familyId, mealPlanIds, memberIds } = req.body;

    if (!familyId) {
        throw new ApiError(400, "Family ID is required");
    }

    if (
        !mealPlanIds ||
        !Array.isArray(mealPlanIds) ||
        mealPlanIds.length === 0
    ) {
        throw new ApiError(400, "At least one meal plan ID is required");
    } // Validate memberIds
    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
        throw new ApiError(
            400,
            "At least one family member is required for assignment"
        );
    }

    const assignedItems = await cartService.assignIngredientsToFamilyMembers(
        familyId,
        mealPlanIds,
        memberIds
    );

    return responseOk(
        res,
        assignedItems,
        "Ingredients assigned to family members successfully"
    );
});

/**
 * Update cart item status and add to fridge if marked as purchased
 * @route PATCH /api/user/cart/:id/status
 * @param {Number} req.params.id - Cart item ID
 * @param {Object} req.body - Request body
 * @param {Number} req.body.status - New status (0: not completed, 1: completed)
 * @param {Number} req.body.family_id - Family ID for adding to fridge
 * @returns {Object} - Updated cart item
 */
exports.updateCartItemStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, family_id } = req.body;

    if (!id) {
        throw new ApiError(400, "Cart item ID is required");
    }

    if (status === undefined || ![0, 1].includes(status)) {
        throw new ApiError(
            400,
            "Valid status is required (0: not completed, 1: completed)"
        );
    }

    // Update the cart item status
    const updatedItem = await cartService.updateCartItemStatus(id, status);

    // If item is marked as completed (purchased), add it to the fridge
    if (status === 1 && family_id) {
        try {
            // Get the ingredient details from the cart item
            await fridgeService.addToFridge({
                family_id,
                ingredient_id: updatedItem.ingredient_id,
                quantity: updatedItem.quantity,
                unit: updatedItem.unit,
            });
        } catch (error) {
            console.error("Error adding ingredient to fridge:", error);
            // Don't fail the whole request if fridge update fails
            // But inform the client about the partial success
            return responseOk(
                res,
                updatedItem,
                "Cart item status updated but failed to add to fridge",
                207 // Multi-status response
            );
        }
    }

    return responseOk(
        res,
        updatedItem,
        "Cart item status updated successfully"
    );
});
