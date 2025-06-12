const {
    Cart,
    User,
    Family,
    Ingredient,
    MealPlan,
    Dish,
    DishIngredient,
    sequelize,
} = require("../../../models");
const { Op } = require("sequelize");

/**
 * Get cart items by user ID
 * @param {Number} userId - User ID
 * @returns {Promise<Array>} - List of cart items for the user
 */
const getCartItemsByUserId = async (userId) => {
    return await Cart.findAll({
        where: { user_id: userId },
        include: [
            {
                model: Ingredient,
                as: "ingredient",
                attributes: ["id", "name", "image_url"],
            },
            {
                model: MealPlan,
                as: "meal_plan",
                include: [
                    {
                        model: Dish,
                        as: "dish",
                        attributes: ["id", "name", "image_url"],
                    },
                ],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
};

/**
 * Get cart items by family ID
 * @param {Number} familyId - Family ID
 * @returns {Promise<Object>} - Object with cart items grouped by user
 */
const getCartItemsByFamilyId = async (familyId) => {
    // First, get all family members
    const family = await Family.findByPk(familyId, {
        include: [
            {
                model: User,
                as: "users",
                attributes: [
                    "id",
                    "full_name",
                    "avatar_url",
                    "email",
                    "family_role",
                ],
            },
        ],
    });

    if (!family) {
        throw new Error("Family not found");
    }

    // Get all cart items for the family members
    const userIds = family.users.map((user) => user.id);

    const cartItems = await Cart.findAll({
        where: {
            user_id: {
                [Op.in]: userIds,
            },
        },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "full_name", "avatar_url", "email"],
            },
            {
                model: Ingredient,
                as: "ingredient",
                attributes: ["id", "name", "image_url"],
            },
            {
                model: MealPlan,
                as: "meal_plan",
                include: [
                    {
                        model: Dish,
                        as: "dish",
                        attributes: ["id", "name", "image_url"],
                    },
                ],
            },
        ],
    });

    // Group cart items by user
    const result = {
        family: {
            id: family.id,
            name: family.name,
        },
        members: family.users.map((user) => {
            const userCartItems = cartItems.filter(
                (item) => item.user_id === user.id
            );
            return {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                avatar_url: user.avatar_url,
                role: user.family_role,
                cart_items: userCartItems,
            };
        }),
    };

    return result;
};

/**
 * Assign ingredients to family members from meal plans
 * @param {Number} familyId - Family ID
 * @param {Array} mealPlanIds - Array of meal plan IDs
 * @param {Array} memberIds - Array of user IDs to assign ingredients to
 * @returns {Promise<Object>} - Object with assigned cart items grouped by user
 */
const assignIngredientsToFamilyMembers = async (
    familyId,
    mealPlanIds,
    memberIds
) => {
    // Start a transaction
    const t = await sequelize.transaction();

    try {
        // 1. Get family members
        const family = await Family.findByPk(familyId, {
            include: [
                {
                    model: User,
                    as: "users",
                    attributes: [
                        "id",
                        "full_name",
                        "avatar_url",
                        "email",
                        "family_role",
                    ],
                },
            ],
            transaction: t,
        });

        if (!family || !family.users || family.users.length === 0) {
            throw new Error("Family not found or has no members");
        }

        // 2. Get meal plans with dish ingredients
        const mealPlans = await MealPlan.findAll({
            where: {
                id: {
                    [Op.in]: mealPlanIds,
                },
                family_id: familyId,
            },
            include: [
                {
                    model: Dish,
                    as: "dish",
                    include: [
                        {
                            model: DishIngredient,
                            as: "dish_ingredients",
                            include: [
                                {
                                    model: Ingredient,
                                    as: "ingredient",
                                },
                            ],
                        },
                    ],
                },
            ],
            transaction: t,
        });

        if (mealPlans.length === 0) {
            throw new Error("No valid meal plans found");
        }

        // 3. First, clear any existing cart items for these meal plans
        await Cart.destroy({
            where: {
                meal_plan_id: {
                    [Op.in]: mealPlanIds,
                },
            },
            transaction: t,
        });

        // 4. Collect all ingredients from meal plans
        const allIngredients = [];

        mealPlans.forEach((mealPlan) => {
            if (mealPlan.dish && mealPlan.dish.dish_ingredients) {
                mealPlan.dish.dish_ingredients.forEach((dishIngredient) => {
                    // Check if the ingredient already exists in our list
                    const existingIngredient = allIngredients.find(
                        (item) =>
                            item.ingredient_id === dishIngredient.ingredient_id
                    );

                    if (existingIngredient) {
                        // If the ingredient exists, add the quantity
                        existingIngredient.quantity += dishIngredient.quantity;
                    } else {
                        // If not, add it to our list
                        allIngredients.push({
                            meal_plan_id: mealPlan.id,
                            ingredient_id: dishIngredient.ingredient_id,
                            quantity: dishIngredient.quantity,
                            unit: dishIngredient.unit,
                        });
                    }
                });
            }
        }); // 5. Assign ingredients to selected family members
        // Filter to include only the selected members
        const selectedMembers = family.users.filter((user) =>
            memberIds.includes(user.id)
        );

        // If no valid members were found, throw an error
        if (selectedMembers.length === 0) {
            throw new Error("No valid family members were selected");
        }

        const cartItems = [];

        allIngredients.forEach((ingredientItem, index) => {
            // Distribute ingredients evenly among selected members using modulo
            const memberIndex = index % selectedMembers.length;
            const assignedUser = selectedMembers[memberIndex];

            cartItems.push({
                meal_plan_id: ingredientItem.meal_plan_id,
                user_id: assignedUser.id,
                ingredient_id: ingredientItem.ingredient_id,
                quantity: ingredientItem.quantity,
                unit: ingredientItem.unit,
                status: 0, // 0: Not completed, 1: Completed
            });
        });

        // 6. Create cart items
        await Cart.bulkCreate(cartItems, { transaction: t }); // Commit the transaction first
        await t.commit();

        // 7. Now that the transaction is committed, get the cart items to return
        const result = await getCartItemsByFamilyId(familyId);

        return result;
    } catch (error) {
        // Rollback the transaction in case of error
        if (t && !t.finished) {
            await t.rollback();
        }
        throw error;
    }
};

/**
 * Update cart item status
 * @param {Number} id - Cart item ID
 * @param {Number} status - New status (0: not completed, 1: completed)
 * @returns {Promise<Object>} - Updated cart item
 */
const updateCartItemStatus = async (id, status) => {
    // Find the cart item first to make sure it exists
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
        throw new Error("Cart item not found");
    }

    // Update the status and completed_at date if marked as completed
    cartItem.status = status;
    cartItem.completed_at = status === 1 ? new Date() : null;

    // Save the changes
    await cartItem.save();

    // Return the updated cart item
    return cartItem;
};

module.exports = {
    getCartItemsByUserId,
    getCartItemsByFamilyId,
    assignIngredientsToFamilyMembers,
    updateCartItemStatus,
};
