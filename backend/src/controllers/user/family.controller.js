const familyService = require("../../services/user/family.service");
const asyncHandler = require("../../middlewares/asyncHandler");
const {
    responseOk,
    responseError,
    paginate,
} = require("../../utils/apiResponse");
const ApiError = require("../../utils/ApiError");

/**
 * Get all families with pagination
 * @route GET /api/user/families
 */
exports.getAllFamilies = async (req, res) => {
    const result = await paginate(req, familyService.getAllFamilies);

    return responseOk(
        res,
        result.data,
        "Families retrieved successfully",
        200,
        result.pagination
    );
};

/**
 * Get family by ID
 * @route GET /api/user/families/:id
 */
exports.getFamilyById = async (req, res) => {
    const { id } = req.params;

    const family = await familyService.getFamilyById(id);

    if (!family) {
        throw new ApiError(404, "Family not found");
    }

    return responseOk(res, family, "Family retrieved successfully");
};

/**
 * Get family of the currently logged-in user
 * @route GET /api/user/families/me
 */
exports.getMyFamily = async (req, res) => {
    // Get the user ID from the request object (set by auth middleware)
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const family = await familyService.getFamilyByUserId(userId);

    if (!family) {
        throw new ApiError(404, "Family not found for this user");
    }

    return responseOk(res, family, "User's family retrieved successfully");
};

/**
 * Create a family for the currently logged-in user
 * @route POST /api/user/families
 */
exports.createFamily = async (req, res) => {
    // Get the user ID from the request object (set by auth middleware)
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // Extract only the family name from the request body
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Family name is required");
    }

    const newFamily = await familyService.createFamily(name);

    if (!newFamily) {
        throw new ApiError(400, "Failed to create family");
    }

    return responseOk(res, newFamily, "Family created successfully");
};