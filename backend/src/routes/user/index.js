const express = require("express");
const router = express.Router();

const dishRoutes = require("./dish.route");
const mealPlanRoutes = require("./mealPlan.route");
const familyRoutes = require("./family.route");

// Define API routes
router.use("/dishes", dishRoutes);
router.use("/meal-plans", mealPlanRoutes);
router.use("/families", familyRoutes);

module.exports = router;
