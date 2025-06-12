const express = require("express");
const router = express.Router();
const dishController = require("../../controllers/user/dish.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/dishes
 * @desc Get all dishes with pagination
 * @query {Number} page - Current page number (default: 1)
 * @query {Number} per_page - Number of dishes per page (default: 10)
 * @access Public
 */
router.get("/", dishController.getAllDishes);

/**
 * @route GET /api/user/dishes/:slug
 * @desc Get dish by id
 * @access Public
 */
router.get("/:slug", dishController.getDishBySlug);

/**
 * @route POST /api/user/dishes
 * @desc Create a new dish with ingredients
 * @access Private
 */
router.post("/", verifyToken, dishController.createDish);

module.exports = router;
