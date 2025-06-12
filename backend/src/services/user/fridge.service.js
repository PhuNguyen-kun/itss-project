const { Fridge, Dish, DishIngredient, Ingredient } = require("../../../models");

/**
 * Get dishes that can be cooked based on ingredients in the family's fridge
 * @param {Number} familyId - ID of the family
 * @returns {Promise<Array>} - Array of dish objects that can be cooked
 */
const getDishesFromFridge = async (familyId) => {
    // Get ingredients in fridge for the family
    const fridgeItems = await Fridge.findAll({
        where: { family_id: familyId },
        attributes: ["ingredient_id", "quantity", "unit"],
    });

    if (!fridgeItems.length) {
        return [];
    }

    // Get all dishes with their required ingredients
    const dishes = await Dish.findAll({
        include: [
            {
                model: DishIngredient,
                as: "dish_ingredients",
                attributes: ["ingredient_id", "quantity", "unit"],
            },
        ],
        attributes: ["id", "name", "slug", "image_url"],
        order: [["name", "ASC"]],
    });

    // Filter dishes that can be cooked
    return dishes
        .filter((dish) => {
            const requiredIngredients = dish.dish_ingredients;
            return requiredIngredients.every((reqIng) => {
                const fridgeItem = fridgeItems.find(
                    (item) =>
                        item.ingredient_id === reqIng.ingredient_id &&
                        item.unit === reqIng.unit
                );
                return fridgeItem && fridgeItem.quantity >= reqIng.quantity;
            });
        })
        .map((dish) => ({
            id: dish.id,
            name: dish.name,
            slug: dish.slug,
            image_url: dish.image_url,
        }));
};

/**
 * Create a new fridge entry
 * @param {Object} fridgeData - Fridge data
 * @param {Number} fridgeData.family_id - ID of the family
 * @param {Number} fridgeData.ingredient_id - ID of the ingredient
 * @param {Number} fridgeData.quantity - Quantity of the ingredient
 * @param {Number} fridgeData.unit - Unit of the ingredient
 * @returns {Promise<Object>} - Created fridge entry
 */
const createFridge = async ({ family_id, ingredient_id, quantity, unit }) => {
    return await Fridge.create({
        family_id,
        ingredient_id,
        quantity,
        unit,
    });
};

/**`
 * Add or update ingredient in fridge
 * @param {Object} fridgeData - Fridge data
 * @param {Number} fridgeData.family_id - ID of the family
 * @param {Number} fridgeData.ingredient_id - ID of the ingredient
 * @param {Number} fridgeData.quantity - Quantity to add
 * @param {Number} fridgeData.unit - Unit of the ingredient
 * @returns {Promise<Object>} - Updated or created fridge entry
 */
const addToFridge = async ({ family_id, ingredient_id, quantity, unit }) => {
    const existingFridge = await Fridge.findOne({
        where: { family_id, ingredient_id, unit },
    });

    if (existingFridge) {
        // Update quantity
        return await existingFridge.update({
            quantity: existingFridge.quantity + quantity,
        });
    }

    // Create new entry
    return await Fridge.create({
        family_id,
        ingredient_id,
        quantity,
        unit,
    });
};

/**
 * Get all fridge items for a family with ingredient details
 * @param {Number} familyId - ID of the family
 * @returns {Promise<Array>} - Array of fridge items with ingredient details
 */
const getFamilyFridgeItems = async (familyId) => {
    return await Fridge.findAll({
        where: { family_id: familyId },
        include: [
            {
                model: Ingredient,
                as: "ingredient",
                attributes: ["id", "name", "image_url"],
            },
        ],
        order: [["updatedAt", "DESC"]],
    });
};

/**
 * Delete an ingredient from fridge
 * @param {Object} fridgeData - Fridge data
 * @param {Number} fridgeData.family_id - ID of the family
 * @param {Number} fridgeData.ingredient_id - ID of the ingredient
 * @param {Number} fridgeData.unit - Unit of the ingredient
 * @returns {Promise<Number>} - Number of deleted records (0 or 1)
 */
const deleteFromFridge = async ({ family_id, ingredient_id, unit }) => {
    return await Fridge.destroy({
        where: { family_id, ingredient_id, unit },
    });
};

module.exports = {
    getDishesFromFridge,
    createFridge,
    addToFridge,
    deleteFromFridge,
    getFamilyFridgeItems,
};
