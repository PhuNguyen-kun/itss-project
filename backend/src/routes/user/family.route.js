const express = require("express");
const router = express.Router();

const familyController = require("../../controllers/user/family.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/families
 * @desc Get all families with pagination
 * @query {Number} page - Current page number (default: 1)
 * @query {Number} per_page - Number of families per page (default: 10)
 * @access Public
 */
router.get("/", familyController.getAllFamilies);

/**
 * @route GET /api/user/families/me
 * @desc Get family of the currently logged-in user
 * @access Private
 */
router.get("/me", verifyToken, familyController.getMyFamily);

/**
 * @route GET /api/user/families/:id
 * @desc Get family by ID
 * @param {Number} id - Family ID
 * @access Public
 */
router.get("/:id", familyController.getFamilyById);

module.exports = router;
