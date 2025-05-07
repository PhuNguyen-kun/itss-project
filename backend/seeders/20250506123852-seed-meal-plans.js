"use strict";

const mealPlanFactory = require("../factories/meal_plan.factory");
const { Family, Dish } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const families = await Family.findAll();
        const dishes = await Dish.findAll();
        const familyIds = families.map((family) => family.id);
        const dishIds = dishes.map((dish) => dish.id);

        const data = Array.from({ length: 80 }).map(() =>
            mealPlanFactory(familyIds, dishIds)
        );
        await queryInterface.bulkInsert("meal_plans", data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("meal_plans", null, {});
    },
};
