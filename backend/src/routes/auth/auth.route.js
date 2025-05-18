const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/auth.controller");
const { verifyToken, isAdmin } = require("../../middlewares/auth.middleware");
const { loginRequest } = require("../../requests/auth/LoginRequest");
const validate = require("../../middlewares/handleValidation");

// Public routes
router.post("/register", authController.register);
router.post("/login", loginRequest, validate, authController.login);
router.post("/google", authController.googleAuth);

// Protected routes
router.get("/profile", verifyToken, authController.getProfile);

module.exports = router;
