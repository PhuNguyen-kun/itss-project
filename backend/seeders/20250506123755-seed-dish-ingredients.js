"use strict";

const dishIngredientFactory = require("../factories/dish_ingredient.factory");
const { Dish, Ingredient } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const dishes = await Dish.findAll();
        const ingredients = await Ingredient.findAll();
        const dishIds = dishes.map((dish) => dish.id);
        const ingredientIds = ingredients.map((ingredient) => ingredient.id);

        const data = Array.from({ length: 100 }).map(() =>
            dishIngredientFactory(dishIds, ingredientIds)
        );
        await queryInterface.bulkInsert("dishes_ingredients", data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("dishes_ingredients", null, {});
    },
};
