"use strict";

const cartFactory = require("../factories/cart.factory");
const { MealPlan, User, Ingredient } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const mealPlans = await MealPlan.findAll();
        const users = await User.findAll();
        const ingredients = await Ingredient.findAll();
        const mealPlanIds = mealPlans.map((mealPlan) => mealPlan.id);
        const userIds = users.map((user) => user.id);
        const ingredientIds = ingredients.map((ingredient) => ingredient.id);

        const data = Array.from({ length: 80 }).map(() =>
            cartFactory(mealPlanIds, userIds, ingredientIds)
        );
        await queryInterface.bulkInsert("carts", data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("carts", null, {});
    },
};
