const express = require("express");
const router = express.Router();
const favoriteController = require("../../controllers/user/favourite.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

// Get all favorites (public API)
router.get("/all", favoriteController.getAllFavorites);

// Get current user's favorites
router.get("/", verifyToken, favoriteController.getAllFavorites);

// Get favorites by user_id
router.get(
    "/user/:user_id",
    verifyToken,
    favoriteController.getFavoritesByUserId
);

// Add to favorites
router.post("/", verifyToken, favoriteController.addToFavorites);

// Remove from favorites
router.delete("/:dishId", verifyToken, favoriteController.removeFromFavorites);

// Check if a dish is in favorites
router.get("/check/:dishId", verifyToken, favoriteController.checkIsFavorite);

module.exports = router;
