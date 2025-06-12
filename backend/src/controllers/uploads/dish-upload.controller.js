const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk } = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");
const path = require("path");
const fs = require("fs");
const { getBaseUrl } = require("../../utils/url");

/**
 * Upload dish image
 * @route POST /api/uploads/dish
 * @access Private
 */
exports.uploadDishImage = asyncHandler(async (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Create URL for the dish image (path relative to static file route)
    const imageUrl = `/public/uploads/dishes/${req.file.filename}`;

    // Get the full URL for frontend use
    const fullImageUrl = `${getBaseUrl()}${imageUrl}`;

    return responseOk(
        res,
        {
            imageUrl,
            fullImageUrl,
        },
        "Dish image uploaded successfully"
    );
});
