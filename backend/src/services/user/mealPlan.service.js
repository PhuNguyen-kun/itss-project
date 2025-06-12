const { MealPlan, Dish, Family } = require("../../../models");
const { Op } = require("sequelize");

/**
 * Get meal plans by family ID
 * @param {Number} familyId - Family ID
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} - List of meal plans for the specified family
 */
const getMealPlan = async () => {
    return await MealPlan.findAll({
        include: [
            {
                model: Dish,
                as: "dish",
                attributes: ["id", "name", "image_url"],
            },
            {
                model: Family,
                as: "family",
                attributes: ["id", "name"],
            },
        ],
        order: [["date", "DESC"]],
    });
};

/**
 * Get meal plans by family ID
 * @param {Number} familyId - Family ID
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} - List of meal plans for the specified family
 */
const getMealPlansByFamilyId = async (familyId, options = {}) => {
    const queryOptions = {
        where: {
            family_id: familyId,
        },
        include: [
            {
                model: Dish,
                as: "dish",
                attributes: ["id", "name", "image_url", "slug", "description"],
            },
        ],
        order: [["date", "DESC"]],
    };

    // Add date filter if provided
    if (options.startDate && options.endDate) {
        queryOptions.where.date = {
            [Op.between]: [options.startDate, options.endDate],
        };
    } else if (options.startDate) {
        queryOptions.where.date = {
            [Op.gte]: options.startDate,
        };
    } else if (options.endDate) {
        queryOptions.where.date = {
            [Op.lte]: options.endDate,
        };
    }

    return await MealPlan.findAll(queryOptions);
};

// Thêm mới một meal plan
const addToMealPlan = async ({ family_id, dish_id, date, meal_type }) => {
    return await MealPlan.create({
        family_id,
        dish_id,
        date,
        meal_type,
    });
};

/**
 * Delete a meal plan by ID
 * @param {Number} id - Meal plan ID to delete
 * @returns {Boolean} - True if deleted, false if not found
 */
const deleteMealPlan = async (id) => {
    const mealPlan = await MealPlan.findByPk(id);
    if (!mealPlan) {
        return false;
    }

    await mealPlan.destroy();
    return true;
};

module.exports = {
    getMealPlan,
    getMealPlansByFamilyId,
    addToMealPlan,
    deleteMealPlan,
};
