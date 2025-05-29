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

module.exports = {
    getAllFavorites,
    getFavoritesByUserId,
};
