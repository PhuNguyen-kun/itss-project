const express = require("express");
const router = express.Router();

const dishRoutes = require("./dish.route");
const mealPlanRoutes = require("./mealPlan.route");
const familyRoutes = require("./family.route");
const cartRoutes = require("./cart.route");
const ingredientRoutes = require("./ingredient.route");
const fridgeRoutes = require("./fridge.route");
const favoriteRoutes = require("./favourite.route");
const profileRoutes = require("./profile.route");
const searchRoutes = require("./search.route");

// Define API routes
router.use("/dishes", dishRoutes);
router.use("/meal-plans", mealPlanRoutes);
router.use("/families", familyRoutes);
router.use("/cart", cartRoutes);
router.use("/ingredients", ingredientRoutes);
router.use("/fridge", fridgeRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/profile", profileRoutes);
router.use("/search", searchRoutes);
module.exports = router;
