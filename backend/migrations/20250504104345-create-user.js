"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
            },
            full_name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            phone_number: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.SMALLINT,
                comment: "1: male, 2: female, 3: other",
            },
            birth_date: {
                type: Sequelize.DATE,
            },
            role: {
                type: Sequelize.SMALLINT,
                comment: "1: admin, 2: user",
            },
            avatar_url: {
                type: Sequelize.STRING,
            },
            google_id: {
                type: Sequelize.STRING,
            },
            family_id: {
                type: Sequelize.BIGINT,
            },
            family_role: {
                type: Sequelize.SMALLINT,
                comment: "1: housekeeper, 2: family member",
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
        await queryInterface.dropTable("users");
    },
};
