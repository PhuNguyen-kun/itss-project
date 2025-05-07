"use strict";

const fridgeFactory = require("../factories/fridge.factory");
const { Family, Ingredient } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const families = await Family.findAll();
        const ingredients = await Ingredient.findAll();
        const familyIds = families.map((family) => family.id);
        const ingredientIds = ingredients.map((ingredient) => ingredient.id);

        const data = Array.from({ length: 80 }).map(() =>
            fridgeFactory(familyIds, ingredientIds)
        );
        await queryInterface.bulkInsert("fridges", data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("fridges", null, {});
    },
};
