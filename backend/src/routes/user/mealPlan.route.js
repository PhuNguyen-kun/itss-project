const express = require("express");
const router = express.Router();
const mealPlanController = require("../../controllers/user/mealPlan.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/meal-plans
 * @desc Get all meal plans
 * @access Public
 */
router.get("/", mealPlanController.getMealPlan);

/**
 * @route GET /api/user/meal-plans/family/:familyId
 * @desc Get meal plans by family ID
 * @param {Number} familyId - Family ID
 * @query {String} startDate - Optional start date filter (YYYY-MM-DD)
 * @query {String} endDate - Optional end date filter (YYYY-MM-DD)
 * @access Private
 */
router.get(
    "/family/:familyId",
    verifyToken,
    mealPlanController.getMealPlansByFamilyId
);

/**
 * @route POST /api/user/meal-plans
 * @desc Add a new meal plan
 * @access Public
 */
router.post("/", mealPlanController.addToMealPlan);

module.exports = router;
