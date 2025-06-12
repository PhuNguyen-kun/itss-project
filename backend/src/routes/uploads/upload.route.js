const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/uploads/upload.controller");
const dishUploadController = require("../../controllers/uploads/dish-upload.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { uploadAvatar, uploadDish } = require("../../config/multer.config");

/**
 * @route POST /api/uploads/avatar
 * @desc Upload user avatar
 * @access Private
 */
router.post(
    "/avatar",
    verifyToken,
    uploadAvatar.single("avatar"),
    uploadController.uploadAvatar
);

/**
 * @route POST /api/uploads/dish
 * @desc Upload dish image
 * @access Private
 */
router.post(
    "/dish",
    verifyToken,
    uploadDish.single("dish_image"),
    dishUploadController.uploadDishImage
);

module.exports = router;
