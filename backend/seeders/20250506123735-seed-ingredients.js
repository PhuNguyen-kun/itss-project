"use strict";

const ingredientFactory = require("../factories/ingredient.factory");
const { Ingredient } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Array.from({ length: 150 }).map(() => ingredientFactory());
        await Ingredient.bulkCreate(data);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("ingredients", null, {});
    },
};
