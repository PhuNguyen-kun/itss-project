"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const fridges = [];

        for (let family_id = 1; family_id <= 30; family_id++) {
            for (let i = 0; i < 3; i++) {
                const ingredient_id = (((family_id - 1) * 3 + i) % 150) + 1;
                const unit = (ingredient_id % 5) + 1;
                const quantity = 100 + i * 50; // 100, 150, 200

                fridges.push({
                    family_id,
                    ingredient_id,
                    quantity,
                    unit,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        await queryInterface.bulkInsert("fridges", fridges, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("fridges", null, {});
    },
};
