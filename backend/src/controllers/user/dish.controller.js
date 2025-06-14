const dishService = require("../../services/user/dish.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    paginate,
} = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

exports.getAllDishes = asyncHandler(async (req, res) => {
    const result = await paginate(req, dishService.getAllDishes);

    return responseOk(
        res,
        result.data,
        "Dishes retrieved successfully",
        200,
        result.pagination
    );
});

exports.getDishBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const dish = await dishService.getDishBySlug(slug);

    if (!dish) {
        throw new ApiError(404, "Dish not found");
    }

    return responseOk(res, dish, "Dish retrieved successfully");
});

/**
 * Create a new dish with ingredients
 * @route POST /api/user/dishes
 * @access Private
 */
exports.createDish = asyncHandler(async (req, res) => {
    const dishData = req.body;

    const dish = await dishService.createDish(dishData);

    return responseOk(res, dish, "Dish created successfully", 201);
});

/**
 * Delete a dish by ID
 * @route DELETE /api/user/dishes/:id
 * @access Private
 */
exports.deleteDish = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const success = await dishService.deleteDish(id);

    if (!success) {
        throw new ApiError(404, "Dish not found or could not be deleted");
    }

    return responseOk(res, null, "Dish deleted successfully");
});
