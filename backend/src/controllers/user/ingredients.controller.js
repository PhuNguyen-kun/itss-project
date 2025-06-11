const ingredientsService = require("../../services/user/ingredients.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    paginate,
} = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

/**
 * Get all ingredients with pagination
 * @route GET /api/user/ingredients
 */
// export