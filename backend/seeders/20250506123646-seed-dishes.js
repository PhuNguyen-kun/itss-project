"use strict";

const dishFactory = require("../factories/dish.factory");
const { Dish } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Array.from({ length: 50 }).map(() => dishFactory());
        await Dish.bulkCreate(data);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("dishes", null, {});
    },
};
