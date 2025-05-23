const mealPlanService = require('../services/mealPlan.service');

// [GET] /api/meal-plan
exports.getMealPlan = async (req, res) => {
  try {
    const mealPlans = await mealPlanService.getMealPlan();
    res.status(200).json(mealPlans);
  } catch (err) {
    console.error('Lỗi lấy meal plan:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy meal plan' });
  }
};

// [POST] /api/meal-plan
exports.addToMealPlan = async (req, res) => {
  try {
    const { family_id, dish_id, date, meal_type } = req.body;

    // Kiểm tra đầu vào
    if (!family_id || !dish_id || !date || meal_type === undefined) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const newMeal = await mealPlanService.addToMealPlan({
      family_id,
      dish_id,
      date,
      meal_type
    });

    res.status(201).json(newMeal);
  } catch (err) {
    console.error('Lỗi thêm meal plan:', err);
    res.status(500).json({ error: 'Lỗi server khi thêm meal plan' });
  }
};
