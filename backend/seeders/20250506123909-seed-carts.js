"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const carts = [];

        for (let i = 1; i <= 60; i++) {
            const meal_plan_id = (i % 90) + 1;
            const user_id = (i % 30) + 1;
            const ingredient_id = (i % 150) + 1;

            const unit = (ingredient_id % 5) + 1; // 1→5 (gram to teaspoon)
            const quantity = 50 + (i % 100); // 50–149g/ml/etc

            const status = i % 2; // alternate between 0 and 1
            const completed_at = status === 1 ? now : null;

            carts.push({
                meal_plan_id,
                user_id,
                ingredient_id,
                quantity,
                unit,
                status,
                completed_at,
                createdAt: now,
                updatedAt: now,
            });
        }

        await queryInterface.bulkInsert("carts", carts, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("carts", null, {});
    },
};
