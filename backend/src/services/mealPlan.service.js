const { MealPlan, Dish, Family } = require('../../models');

// Lấy danh sách meal plan, kèm dish và family
exports.getMealPlan = async () => {
  return await MealPlan.findAll({
    include: [
      {
        model: Dish,
        as: 'dish',
        attributes: ['id', 'name', 'image_url']
      },
      {
        model: Family,
        as: 'family',
        attributes: ['id', 'name']
      }
    ],
    order: [['date', 'DESC']]
  });
};

// Thêm mới một meal plan
exports.addToMealPlan = async ({ family_id, dish_id, date, meal_type }) => {
  return await MealPlan.create({
    family_id,
    dish_id,
    date,
    meal_type
  });
};
