const express = require("express");
const router = express.Router();
const ingredientController = require("../../controllers/user/ingredient.controller");

/**
 * @route GET /api/user/ingredients
 * @desc Get all ingredients with pagination
 * @query {Number} page - Current page number (default: 1)
 * @query {Number} per_page - Number of ingredients per page (default: 10)
 * @access Public
 */
router.get("/", ingredientController.getAllIngredients);

/**
 * @route GET /api/user/ingredients/:id
 * @desc Get ingredient by id
 * @access Public
 */
router.get("/:id", ingredientController.getIngredientById);

module.exports = router;
