const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk } = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");
const { User } = require("../../../models");
const path = require("path");
const fs = require("fs");

/**
 * Upload user avatar
 * @route POST /api/uploads/avatar
 * @access Private
 */
exports.uploadAvatar = asyncHandler(async (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Get user ID from request (set by auth middleware)
    const userId = req.user.id;

    // Find user in database
    const user = await User.findByPk(userId);

    if (!user) {
        // Delete uploaded file if user not found
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        throw new ApiError(404, "User not found");
    }

    // If user already has an avatar, delete the old file
    if (user.avatar_url) {
        const oldAvatarPath = user.avatar_url.replace("/public/", "");
        const fullPath = path.join(
            __dirname,
            "../../../public/",
            oldAvatarPath
        );

        // Check if file exists before attempting to delete
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } // Create URL for the avatar (path relative to static file route)
    // The URL should start with /public since that's how we configured the static route
    const avatarUrl = `/public/uploads/avatars/${req.file.filename}`;

    // Update user with new avatar URL
    await user.update({ avatar_url: avatarUrl });

    // Get the full URL for frontend use
    const { getBaseUrl } = require("../../utils/url");
    const fullAvatarUrl = `${getBaseUrl()}${avatarUrl}`;

    return responseOk(
        res,
        { avatarUrl, fullAvatarUrl },
        "Avatar uploaded successfully"
    );
});
