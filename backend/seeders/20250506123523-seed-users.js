"use strict";

const userFactory = require("../factories/user.factory");
const { User, Family } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const families = await Family.findAll();
        const familyIds = families.map((family) => family.id);

        const data = Array.from({ length: 200 }).map(() =>
            userFactory(familyIds)
        );
        await User.bulkCreate(data);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    },
};
