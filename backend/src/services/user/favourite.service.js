const { Favorite, Dish } = require("../../../models");

/**
 * Get all favorites with optional pagination
 * @param {Object} options - Query options
 * @param {Number} options.limit - Number of favorites per page
 * @param {Number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - { count, rows } for findAndCountAll result
 */
const getAllFavorites = async (options = {}) => {
    const queryOptions = {
        include: [
            {
                model: Dish,
                as: "dish",
            },
        ],
        order: [["createdAt", "DESC"]],
        distinct: true,
    };

    if (options.limit) queryOptions.limit = options.limit;
    if (options.offset !== undefined) queryOptions.offset = options.offset;

    return await Favorite.findAndCountAll(queryOptions);
};

/**
 * Get favorites by user_id with optional pagination
 * @param {Number} userId
 * @param {Object} options - { limit, offset }
 * @returns {Promise<Object>} - { count, rows }
 */
const getFavoritesByUserId = async (userId, options = {}) => {
    const queryOptions = {
        where: { user_id: userId },
        include: [
            {
                model: Dish,
                as: "dish",
            },
        ],
        order: [["createdAt", "DESC"]],
        distinct: true,
    };

    if (options.limit) queryOptions.limit = options.limit;
    if (options.offset !== undefined) queryOptions.offset = options.offset;

    return await Favorite.findAndCountAll(queryOptions);
};

/**
 * Add a dish to favorites
 * @param {Number} userId - User ID
 * @param {Number} dishId - Dish ID to add to favorites
 * @returns {Promise<Object>} - Created favorite entry
 */
const addToFavorites = async (userId, dishId) => {
    // Check if favorite already exists
    const existing = await Favorite.findOne({
        where: { user_id: userId, dish_id: dishId },
    });

    if (existing) {
        return existing;
    }

    // Create new favorite
    const favorite = await Favorite.create({
        user_id: userId,
        dish_id: dishId,
    });

    // Return with dish details
    return await Favorite.findByPk(favorite.id, {
        include: [{ model: Dish, as: "dish" }],
    });
};

/**
 * Remove a dish from favorites
 * @param {Number} userId - User ID
 * @param {Number} dishId - Dish ID to remove from favorites
 * @returns {Promise<Number>} - Number of records deleted (0 or 1)
 */
const removeFromFavorites = async (userId, dishId) => {
    return await Favorite.destroy({
        where: { user_id: userId, dish_id: dishId },
    });
};

/**
 * Check if a dish is in user's favorites
 * @param {Number} userId - User ID
 * @param {Number} dishId - Dish ID to check
 * @returns {Promise<Boolean>} - True if dish is in favorites, false otherwise
 */
const checkIsFavorite = async (userId, dishId) => {
    const favorite = await Favorite.findOne({
        where: { user_id: userId, dish_id: dishId },
    });
    return !!favorite;
};

module.exports = {
    getAllFavorites,
    getFavoritesByUserId,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
};
