"use strict";

const favoriteFactory = require("../factories/favorite.factory");
const { User, Dish } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await User.findAll();
        const dishes = await Dish.findAll();
        const userIds = users.map((user) => user.id);
        const dishIds = dishes.map((dish) => dish.id);

        const data = Array.from({ length: 80 }).map(() =>
            favoriteFactory(userIds, dishIds)
        );
        await queryInterface.bulkInsert("favorites", data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("favorites", null, {});
    },
};
