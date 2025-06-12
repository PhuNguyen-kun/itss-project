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
        throw new ApiError(
            404,
            "Hãy liên hệ với người nội trợ để được thêm vào gia đình"
        );
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

/**
 * Add members to a family
 * @route POST /api/user/families/:id/members
 */
exports.addMembers = asyncHandler(async (req, res) => {
    // Get the user ID from the request object (set by auth middleware)
    const userId = req.user.id;
    const familyId = parseInt(req.params.id);
    const { userIds } = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(400, "User IDs array is required");
    }

    // Check if the current user is a housekeeper of the family
    const user = await familyService.getUserById(userId);

    console.log(user.family_role);

    // if (!user || user.family_id !== familyId || user.family_role !== 0) {
    //     throw new ApiError(
    //         403,
    //         "Only housekeepers can add members to the family"
    //     );
    // }

    // Add members to the family
    const result = await familyService.addMembersToFamily(familyId, userIds);

    return responseOk(res, result, "Members added to family successfully");
});
