function mealPlanFactory(familyIds = [], dishIds = []) {
    return {
        family_id: randomFromArray(familyIds),
        dish_id: randomFromArray(dishIds),
        date: faker.date.soon(),
        meal_type: faker.helpers.arrayElement([1, 2, 3]),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

const { faker } = require("@faker-js/faker");
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = mealPlanFactory;
