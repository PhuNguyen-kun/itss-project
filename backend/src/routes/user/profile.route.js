const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/user/profile.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/profile
 * @desc Get user profile
 * @access Private
 */
router.get("/", verifyToken, profileController.getUserProfile);

/**
 * @route PUT /api/user/profile
 * @desc Update user profile
 * @access Private
 */
router.put("/", verifyToken, profileController.updateUserProfile);

/**
 * @route PUT /api/user/profile/change-password
 * @desc Change user password
 * @access Private
 */
router.put("/change-password", verifyToken, profileController.changePassword);

module.exports = router;
