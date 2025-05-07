"use strict";

const familyFactory = require("../factories/family.factory");
const { Family } = require("../models");

module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Array.from({ length: 40 }).map(() => familyFactory());
        await Family.bulkCreate(data);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("families", null, {});
    },
};
