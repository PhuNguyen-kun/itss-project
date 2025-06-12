const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/user/search.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

/**
 * @route GET /api/user/search
 * @desc Search for users by name or email
 * @query {String} query - Search query for name or email
 * @access Private (requires authentication)
 */
router.get("/", verifyToken, searchController.searchUsers);

module.exports = router;
