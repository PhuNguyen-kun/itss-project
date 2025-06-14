const ingredientService = require("../../services/user/ingredient.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const { responseOk, paginate } = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

exports.getAllIngredients = asyncHandler(async (req, res) => {
    const result = await paginate(req, ingredientService.getAllIngredients);

    return responseOk(
        res,
        result.data,
        "Ingredients retrieved successfully",
        200,
        result.pagination
    );
});

exports.getIngredientById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ingredient = await ingredientService.getIngredientById(id);

    if (!ingredient) {
        throw new ApiError(404, "Ingredient not found");
    }

    return responseOk(res, ingredient, "Ingredient retrieved successfully");
});

/**
 * Delete an ingredient by ID
 * @route DELETE /api/user/ingredients/:id
 * @access Private
 */
exports.deleteIngredient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const success = await ingredientService.deleteIngredient(id);

    if (!success) {
        throw new ApiError(404, "Ingredient not found or could not be deleted");
    }

    return responseOk(res, null, "Ingredient deleted successfully");
});
