const asyncHandler = require('../../middlewares/asyncHandler');
const fridgeService = require('../../services/user/fridge.service');
const { responseOk, responseError, paginate } = require('../../utils/apiResponse');
const ApiError = require('../../utils/ApiError');
// const { User } = require('../../models');

/**
 * Get dishes that can be cooked from fridge ingredients
 * @route GET /api/fridge/:familyId/dishes
 */
exports.getDishesFromFridge = asyncHandler(async (req, res) => {

    const { family_id } = req.params;

    const result = await paginate(req, async (queryOptions) => {
        const dishes = await fridgeService.getDishesFromFridge(family_id);
        return {
            count: dishes.length,
            rows: dishes.slice(queryOptions.offset, queryOptions.offset + queryOptions.limit),
        };
    });

    return responseOk(
        res,
        result.data,
        'Dishes from fridge retrieved successfully',
        200,
        result.pagination
    );
});

/**
 * Create a new fridge entry
 * @route POST /api/fridge
 */
exports.createFridge = asyncHandler(async (req, res) => {
    const { family_id, ingredient_id, quantity, unit } = req.body;

    const fridge = await fridgeService.createFridge({ family_id, ingredient_id, quantity, unit });

    return responseOk(res, fridge, 'Fridge entry created successfully', 201);
});

/**
 * Add or update ingredient in fridge
 * @route PUT /api/fridge
 */
exports.addToFridge = asyncHandler(async (req, res) => {
    const { family_id, ingredient_id, quantity, unit } = req.body;

    const fridge = await fridgeService.addToFridge({ family_id, ingredient_id, quantity, unit });

    return responseOk(res, fridge, 'Ingredient added to fridge successfully', 200);
});

/**
 * Delete an ingredient from fridge
 * @route DELETE /api/fridge
 */
exports.deleteFromFridge = asyncHandler(async (req, res) => {

    const { family_id, ingredient_id, unit } = req.body;

    const deletedCount = await fridgeService.deleteFromFridge({ family_id, ingredient_id, unit });

    if (deletedCount === 0) {
        throw new ApiError(404, 'Ingredient not found in fridge');
    }

    return responseOk(res, { deleted: deletedCount }, 'Ingredient removed from fridge successfully', 200);
});