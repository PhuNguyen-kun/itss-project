const { User, Family } = require("../../../models");
const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk } = require("../../utils/apiResponse");
const userResource = require("../../resources/user.resource");
const ApiError = require("../../utils/ApiError");
const bcrypt = require("bcryptjs");

/**
 * Get user profile
 * @route GET /api/user/profile
 * @access Private
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
        include: [
            {
                model: Family,
                as: "family",
                attributes: ["id", "name"],
            },
        ],
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return responseOk(res, user, "User profile retrieved successfully");
});

/**
 * Update user profile
 * @route PUT /api/user/profile
 * @access Private
 */
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { full_name, phone_number, gender, birth_date, avatar_url } =
        req.body; // Update user information
    const updatedUser = await user.update({
        full_name: full_name || user.full_name,
        phone_number: phone_number || user.phone_number,
        gender: gender !== undefined ? gender : user.gender,
        birth_date: birth_date || user.birth_date,
        avatar_url: avatar_url || user.avatar_url,
        family_role:
            req.body.family_role !== undefined
                ? req.body.family_role
                : user.family_role,
    });

    // Get user with family information for response
    const userWithFamily = await User.findByPk(userId, {
        include: [
            {
                model: Family,
                as: "family",
                attributes: ["id", "name"],
            },
        ],
    });

    return responseOk(res, userWithFamily, "Profile updated successfully");
});

/**
 * Change user password
 * @route PUT /api/user/profile/change-password
 * @access Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate request body
    if (!currentPassword || !newPassword) {
        throw new ApiError(
            400,
            "Current password and new password are required"
        );
    }

    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if current password is correct
    const isMatch = bcrypt.compareSync(currentPassword, user.password);

    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect");
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update password
    await user.update({ password: hashedPassword });

    return responseOk(res, null, "Password changed successfully");
});
