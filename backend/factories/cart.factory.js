function cartFactory(mealPlanIds = [], userIds = [], ingredientIds = []) {
    return {
        meal_plan_id: randomFromArray(mealPlanIds),
        user_id: randomFromArray(userIds),
        ingredient_id: randomFromArray(ingredientIds),
        quantity: Math.floor(Math.random() * 5) + 1,
        unit: Math.floor(Math.random() * 5) + 1,
        status: faker.helpers.arrayElement([0, 1]),
        completed_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

const { faker } = require("@faker-js/faker");
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = cartFactory;
