const { MealPlan, Dish, Family } = require("../../../models");
const { Op } = require("sequelize");

// Lấy danh sách meal plan, kèm dish và family
exports.getMealPlan = async () => {
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
exports.getMealPlansByFamilyId = async (familyId, options = {}) => {
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
exports.addToMealPlan = async ({ family_id, dish_id, date, meal_type }) => {
    return await MealPlan.create({
        family_id,
        dish_id,
        date,
        meal_type,
    });
};
