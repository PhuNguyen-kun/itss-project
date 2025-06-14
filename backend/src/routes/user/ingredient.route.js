const express = require("express");
const router = express.Router();
const ingredientController = require("../../controllers/user/ingredient.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/ingredients
 * @desc Get all ingredients with pagination
 * @query {Number} page - Current page number (default: 1)
 * @query {Number} per_page - Number of ingredients per page (default: 10)
 * @query {String} search - Search term to filter by name
 * @access Public
 */
router.get("/", ingredientController.getAllIngredients);

/**
 * @route GET /api/user/ingredients/:id
 * @desc Get ingredient by id
 * @access Public
 */
router.get("/:id", ingredientController.getIngredientById);

/**
 * @route DELETE /api/user/ingredients/:id
 * @desc Delete an ingredient by ID
 * @access Private
 */
router.delete("/:id", verifyToken, ingredientController.deleteIngredient);

module.exports = router;
