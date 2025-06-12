const mealPlanService = require("../../services/user/mealPlan.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk, responseError } = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

// [GET] /api/meal-plan
exports.getMealPlan = async (req, res) => {
    try {
        const mealPlans = await mealPlanService.getMealPlan();
        res.status(200).json(mealPlans);
    } catch (err) {
        console.error("Lỗi lấy meal plan:", err);
        res.status(500).json({ error: "Lỗi server khi lấy meal plan" });
    }
};

/**
 * Get meal plans by family ID
 * @route GET /api/user/meal-plans/family/:familyId
 * @param {Number} req.params.familyId - Family ID
 * @param {String} [req.query.startDate] - Optional start date filter (YYYY-MM-DD)
 * @param {String} [req.query.endDate] - Optional end date filter (YYYY-MM-DD)
 * @returns {Array} - List of meal plans for the family
 */
exports.getMealPlansByFamilyId = asyncHandler(async (req, res) => {
    const { familyId } = req.params;

    if (!familyId) {
        throw new ApiError(400, "Family ID is required");
    }

    // Parse date filters if provided
    const options = {};
    if (req.query.startDate) {
        options.startDate = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
        options.endDate = new Date(req.query.endDate);
    }

    const mealPlans = await mealPlanService.getMealPlansByFamilyId(
        familyId,
        options
    );

    return responseOk(res, mealPlans, "Meal plans retrieved successfully");
});

// [POST] /api/meal-plan
exports.addToMealPlan = async (req, res) => {
    try {
        const { family_id, dish_id, date, meal_type } = req.body;

        // Kiểm tra đầu vào
        if (!family_id || !dish_id || !date || meal_type === undefined) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        }

        const newMeal = await mealPlanService.addToMealPlan({
            family_id,
            dish_id,
            date,
            meal_type,
        });

        res.status(201).json(newMeal);
    } catch (err) {
        console.error("Lỗi thêm meal plan:", err);
        res.status(500).json({ error: "Lỗi server khi thêm meal plan" });
    }
};

/**
 * Delete a meal plan by ID
 * @route DELETE /api/user/meal-plans/:id
 * @param {Number} req.params.id - Meal plan ID to delete
 * @returns {Object} - Confirmation message
 */
exports.deleteMealPlan = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Meal plan ID is required");
    }

    const result = await mealPlanService.deleteMealPlan(id);

    if (!result) {
        throw new ApiError(
            404,
            "Không tìm thấy kế hoạch bữa ăn hoặc không có quyền xóa"
        );
    }

    return responseOk(res, null, "Xóa kế hoạch bữa ăn thành công");
});
