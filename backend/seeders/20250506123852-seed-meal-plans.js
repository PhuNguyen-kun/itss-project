"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const mealPlans = [];

        for (let familyId = 1; familyId <= 30; familyId++) {
            for (let mealType = 1; mealType <= 3; mealType++) {
                const dishId = ((familyId + mealType) % 30) + 1; // Đảm bảo chọn dish_id trong khoảng 1–30
                mealPlans.push({
                    family_id: familyId,
                    dish_id: dishId,
                    date: new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate()
                    ),
                    meal_type: mealType,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        await queryInterface.bulkInsert("meal_plans", mealPlans, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("meal_plans", null, {});
    },
};
