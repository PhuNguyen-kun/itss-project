const { Op } = require("sequelize");
const { User } = require("../../../models");
const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk } = require("../../utils/apiResponse");

/**
 * Search users by name or email
 * @route GET /api/user/search
 * @query {String} query - Search query for name or email
 * @access Private
 */
exports.searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === "") {
        return responseOk(res, [], "No search query provided");
    }

    // Search for users by name or email
    const users = await User.findAll({
        where: {
            [Op.or]: [
                { full_name: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
            ],
            // Exclude the current user from search results
            id: { [Op.ne]: req.user.id },
        },
        attributes: [
            "id",
            "full_name",
            "email",
            "gender",
            "avatar_url",
            "family_id",
            "family_role",
        ],
        limit: 10,
    });

    return responseOk(res, users, "Users retrieved successfully");
});
