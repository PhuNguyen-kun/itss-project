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

/**
 * @route POST /api/user/families
 * @desc Create a new family for the logged-in user
 * @access Private
 */
router.post("/", verifyToken, familyController.createFamily);

/**
 * @route PUT /api/user/families/:id
 * @desc Update a family
 * @param {Number} id - Family ID
 * @access Private
 */
router.put("/:id", verifyToken, familyController.updateFamily);

/**
 * @route DELETE /api/user/families/:id
 * @desc Delete a family
 * @param {Number} id - Family ID
 * @access Private
 */
router.delete("/:id", verifyToken, familyController.deleteFamily);

/**
 * @route POST /api/user/families/:id/members
 * @desc Add members to a family
 * @param {Number} id - Family ID
 * @body {Array} userIds - Array of user IDs to add to the family
 * @access Private (only housekeepers can add members)
 */
router.post("/:id/members", verifyToken, familyController.addMembers);

module.exports = router;
