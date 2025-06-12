const express = require("express");
const router = express.Router();

const fridgeController = require("../../controllers/user/fridge.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/fridge/:familyId/dishes
 * @desc Get dishes that can be cooked from fridge ingredients
 * @param {Number} familyId - Family ID
 * @query {Number} page - Current page number (default: 1)
 * @query {Number} per_page - Number of dishes per page (default: 10)
 * @access Private
 */
router.get("/:family_id/dishes", fridgeController.getDishesFromFridge);

/**
 * @route POST /api/user/fridge
 * @desc Create a new fridge entry
 * @body {Number} family_id - Family ID
 * @body {Number} ingredient_id - Ingredient ID
 * @body {Number} quantity - Quantity of the ingredient
 * @body {Number} unit - Unit of the ingredient
 * @access Private
 */
router.post("/", fridgeController.createFridge);

/**
 * @route PUT /api/fridge
 * @desc Add or update ingredient in fridge
 * @body {Number} family_id - Family ID
 * @body {Number} ingredient_id - Ingredient ID
 * @body {Number} quantity - Quantity to add
 * @body {Number} unit - Unit of the ingredient
 * @access Private
 */
router.put("/", fridgeController.addToFridge);

/**
 * @route DELETE /api/fridge
 * @desc Delete an ingredient from fridge
 * @body {Number} family_id - Family ID
 * @body {Number} ingredient_id - Ingredient ID
 * @body {Number} unit - Unit of the ingredient
 * @access Private
 */
router.delete("/", fridgeController.deleteFromFridge);

/**
 * @route GET /api/user/fridge/family/:familyId
 * @desc Get all fridge items for a family
 * @param {Number} familyId - Family ID
 * @access Private
 */
router.get(
    "/family/:familyId",
    verifyToken,
    fridgeController.getFamilyFridgeItems
);

module.exports = router;
