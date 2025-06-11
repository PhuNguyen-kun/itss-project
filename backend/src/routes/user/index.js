const express = require("express");
const router = express.Router();

const dishRoutes = require("./dish.route");
const mealPlanRoutes = require("./mealPlan.route");
const familyRoutes = require("./family.route");
const cartRoutes = require("./cart.route");
const ingredientsRoutes = require("./ingredients.route");
const fridgeRoutes = require("./fridge.route");
// Define API routes
router.use("/dishes", dishRoutes);
router.use("/meal-plans", mealPlanRoutes);
router.use("/families", familyRoutes);
// router.use("/cart", cartRoutes);
// router.use("/ingredients", ingredientsRoutes);
router.use("/fridge", fridgeRoutes);
module.exports = router;
