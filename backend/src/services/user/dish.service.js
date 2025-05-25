const { Dish, DishIngredient, Ingredient } = require("../../../models");

/**
 * Get all dishes with optional pagination
 * @param {Object} options - Query options
 * @param {Number} options.limit - Number of dishes to return
 * @param {Number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - { count, rows } for findAndCountAll result
 */
const getAllDishes = async (options = {}) => {
    const queryOptions = {
        include: [
            {
                model: DishIngredient,
                as: "dish_ingredients",
                include: [
                    {
                        model: Ingredient,
                        as: "ingredient",
                    },
                ],
            },
        ],
        distinct: true,
    };

    // Add pagination params if provided
    if (options.limit) {
        queryOptions.limit = options.limit;
    }

    if (options.offset !== undefined) {
        queryOptions.offset = options.offset;
    }

    return await Dish.findAndCountAll(queryOptions);
};

const getDishBySlug = async (slug) => {
    const dish = await Dish.findOne({
        where: { slug },
        include: [
            {
                model: DishIngredient,
                as: "dish_ingredients",
                include: [
                    {
                        model: Ingredient,
                        as: "ingredient",
                    },
                ],
            },
        ],
    });

    return dish;
};

module.exports = {
    getAllDishes,
    getDishBySlug,
};
