"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("meal_plans", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
            },
            family_id: {
                type: Sequelize.BIGINT,
            },
            dish_id: {
                type: Sequelize.BIGINT,
            },
            date: {
                type: Sequelize.DATE,
            },
            meal_type: {
                type: Sequelize.SMALLINT,
                comment: "0: all, 1: breakfast, 2: lunch, 3: dinner",
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
        await queryInterface.dropTable("meal_plans");
    },
};
