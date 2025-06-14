const {
    Dish,
    DishIngredient,
    Ingredient,
    sequelize,
} = require("../../../models");

/**
 * Get all dishes with optional pagination
 * @param {Object} options - Query options
 * @param {Number} options.limit - Number of dishes to return
 * @param {Number} options.offset - Offset for pagination
 * @param {String} options.search - Search term for dish name
 * @returns {Promise<Object>} - { count, rows } for findAndCountAll result
 */
const getAllDishes = async (options = {}) => {
    const queryOptions = {
        where: {},
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

/**
 * Create a new dish with associated ingredients
 * @param {Object} dishData - Dish data
 * @param {String} dishData.name - Name of the dish
 * @param {String} dishData.image_url - Image URL
 * @param {String} dishData.description - Description
 * @param {String} dishData.instructions - Instructions
 * @param {Array} dishData.ingredients - Associated ingredients with quantity, unit and price
 * @returns {Promise<Object>} - Created dish with its ingredients
 */
const createDish = async (dishData) => {
    const { ingredients, ...dishDetails } = dishData;

    const result = await sequelize.transaction(async (t) => {
        // Create the dish
        const dish = await Dish.create(dishDetails, { transaction: t });

        // Create dish-ingredient associations
        if (ingredients && ingredients.length > 0) {
            const dishIngredients = ingredients.map((ing) => ({
                dish_id: dish.id,
                ingredient_id: ing.id,
                quantity: ing.quantity,
                unit: ing.unit,
                price: ing.price,
            }));

            await DishIngredient.bulkCreate(dishIngredients, {
                transaction: t,
            });
        }

        // Fetch the created dish with its ingredients
        return await Dish.findByPk(dish.id, {
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
            transaction: t,
        });
    });

    return result;
};

/**
 * Delete a dish by ID
 * @param {Number} id - The ID of the dish to delete
 * @returns {Promise<Boolean>} - True if dish was deleted, false otherwise
 */
const deleteDish = async (id) => {
    const result = await sequelize.transaction(async (t) => {
        // First delete associated dish ingredients
        await DishIngredient.destroy({
            where: { dish_id: id },
            transaction: t,
        });

        // Then delete the dish
        const deleted = await Dish.destroy({
            where: { id },
            transaction: t,
        });

        return deleted > 0;
    });

    return result;
};

module.exports = {
    getAllDishes,
    getDishBySlug,
    createDish,
    deleteDish,
};
