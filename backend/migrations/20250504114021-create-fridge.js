"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("fridges", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
            },
            family_id: {
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
        await queryInterface.dropTable("fridges");
    },
};
