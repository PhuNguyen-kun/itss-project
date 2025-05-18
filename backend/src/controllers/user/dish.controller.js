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
