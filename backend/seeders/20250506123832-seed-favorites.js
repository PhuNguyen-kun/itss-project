"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const favorites = [];

        const userDishPairs = [
            [1, 5],
            [2, 3],
            [3, 10],
            [4, 1],
            [5, 8],
            [6, 6],
            [7, 15],
            [8, 2],
            [9, 4],
            [10, 11],
            [11, 13],
            [12, 7],
            [13, 9],
            [14, 17],
            [15, 12],
            [16, 16],
            [17, 20],
            [18, 18],
            [19, 14],
            [20, 19],
            [21, 21],
            [22, 22],
            [23, 23],
            [24, 24],
            [25, 25],
            [26, 26],
            [27, 27],
            [28, 28],
            [29, 29],
            [30, 30],
            [31, 1],
            [32, 2],
            [33, 3],
            [34, 4],
            [35, 5],
            [36, 6],
            [37, 7],
            [38, 8],
            [39, 9],
            [40, 10],
            [41, 11],
            [42, 12],
            [43, 13],
            [44, 14],
            [45, 15],
            [46, 16],
            [47, 17],
            [48, 18],
            [49, 19],
            [50, 20],
        ];

        for (const [user_id, dish_id] of userDishPairs) {
            favorites.push({
                user_id,
                dish_id,
                createdAt: now,
                updatedAt: now,
            });
        }

        await queryInterface.bulkInsert("favorites", favorites, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("favorites", null, {});
    },
};
