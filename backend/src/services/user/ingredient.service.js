const { Ingredient, sequelize } = require("../../../models");

/**
 * Get all ingredients with optional pagination
 * @param {Object} options - Query options
 * @param {Number} options.limit - Number of ingredients to return
 * @param {Number} options.offset - Offset for pagination
 * @param {String} options.search - Search term for ingredient name
 * @returns {Promise<Object>} - { count, rows } for findAndCountAll result
 */
const getAllIngredients = async (options = {}) => {
    const queryOptions = {
        where: {},
        distinct: true,
    };

    // Add search functionality if search parameter is provided
    if (options.search) {
        queryOptions.where.name = {
            [sequelize.Op.like]: `%${options.search}%`,
        };
    }

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

/**
 * Delete an ingredient by ID
 * @param {Number} id - The ID of the ingredient to delete
 * @returns {Promise<Boolean>} - True if ingredient was deleted, false otherwise
 */
const deleteIngredient = async (id) => {
    const deleted = await Ingredient.destroy({
        where: { id },
    });

    return deleted > 0;
};

module.exports = {
    getAllIngredients,
    getIngredientById,
    deleteIngredient,
};
