const { Ingredient } = require("../../../models");

/**
 * Get all ingredients with optional pagination
 * @param {Object} options - Query options
 * @param {Number} options.limit - Number of ingredients to return
 * @param {Number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - { count, rows } for findAndCountAll result
 */
const getAllIngredients = async (options = {}) => {
    const queryOptions = {
        distinct: true,
    };

    // Add pagination params if provided
    if (options.limit) {
        queryOptions.limit = options.limit;
    }

    if (options.offset !== undefined) {
        queryOptions.offset = options.offset;
    }

    return await Ingredient.findAndCountAll(queryOptions);
};

/**
 * Get ingredient by id
 * @param {Number} id - Ingredient id
 * @returns {Promise<Object>} - Ingredient object
 */
const getIngredientById = async (id) => {
    const ingredient = await Ingredient.findByPk(id);
    return ingredient;
};

module.exports = {
    getAllIngredients,
    getIngredientById,
};
