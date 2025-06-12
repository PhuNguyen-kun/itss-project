const favouriteService = require("../../services/user/favourite.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    paginate,
} = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

/**
 * Get all favorites with pagination
 * @route GET /api/user/favorites
 * @access Public
 */
const getAllFavorites = async (req, res, next) => {
    try {
        const result = await paginate(req, favouriteService.getAllFavorites);
        return responseOk(
            res,
            result.data,
            "Favorites retrieved successfully",
            200,
            result.pagination
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user's favorites
 * @route GET /api/user/favorites
 * @access Private
 */
const getMyFavorites = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await paginate(req, (paginationOptions) =>
        favouriteService.getFavoritesByUserId(userId, paginationOptions)
    );

    return responseOk(
        res,
        result.data,
        "Your favorites retrieved successfully",
        200,
        result.pagination
    );
});

/**
 * Get favorites by user ID
 * @route GET /api/user/favorites/user/:user_id
 * @access Private
 */
const getFavoritesByUserId = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.user_id);

        // Check if user is requesting their own favorites or is admin
        if (String(req.user.id) !== String(userId)) {
            return responseError(res, "Unauthorized", 403);
        }

        const result = await paginate(req, (paginationOptions) =>
            favouriteService.getFavoritesByUserId(userId, paginationOptions)
        );

        return responseOk(
            res,
            result.data,
            "Favorites retrieved successfully by user ID",
            200,
            result.pagination
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Add a dish to favorites
 * @route POST /api/user/favorites
 * @body {Number} dish_id - Dish ID to add to favorites
 * @access Private
 */
const addToFavorites = asyncHandler(async (req, res) => {
    const { dish_id } = req.body;
    const user_id = req.user.id;

    if (!dish_id) {
        throw new ApiError(400, "Dish ID is required");
    }

    const favorite = await favouriteService.addToFavorites(user_id, dish_id);

    return responseOk(
        res,
        favorite,
        "Dish added to favorites successfully",
        201
    );
});

/**
 * Remove a dish from favorites
 * @route DELETE /api/user/favorites/:dishId
 * @param {Number} dishId - Dish ID to remove from favorites
 * @access Private
 */
const removeFromFavorites = asyncHandler(async (req, res) => {
    const dishId = req.params.dishId;
    const user_id = req.user.id;

    if (!dishId) {
        throw new ApiError(400, "Dish ID is required");
    }

    const deleted = await favouriteService.removeFromFavorites(user_id, dishId);

    if (!deleted) {
        throw new ApiError(404, "Favorite not found");
    }

    return responseOk(
        res,
        { deleted },
        "Dish removed from favorites successfully"
    );
});

/**
 * Check if a dish is in favorites
 * @route GET /api/user/favorites/check/:dishId
 * @param {Number} dishId - Dish ID to check
 * @access Private
 */
const checkIsFavorite = asyncHandler(async (req, res) => {
    const dishId = req.params.dishId;
    const user_id = req.user.id;

    if (!dishId) {
        throw new ApiError(400, "Dish ID is required");
    }

    const isFavorite = await favouriteService.checkIsFavorite(user_id, dishId);

    return responseOk(
        res,
        { isFavorite },
        "Favorite status checked successfully"
    );
});

module.exports = {
    getAllFavorites,
    getMyFavorites,
    getFavoritesByUserId,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
};
