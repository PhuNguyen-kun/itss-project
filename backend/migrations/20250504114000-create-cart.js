"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("carts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
            },
            meal_plan_id: {
                type: Sequelize.BIGINT,
            },
            user_id: {
                type: Sequelize.BIGINT,
            },
            ingredient_id: {
                type: Sequelize.BIGINT,
            },
            quantity: {
                type: Sequelize.INTEGER,
            },
            unit: {
                type: Sequelize.SMALLINT,
                comment: "1: gram, 2: ml, 3: piece, 4: slice, 5: teaspoon",
            },
            status: {
                type: Sequelize.SMALLINT,
                comment: "0: not completed, 1: completed",
            },
            completed_at: {
                type: Sequelize.DATE,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("carts");
    },
};
