const { faker } = require("@faker-js/faker");

function capitalizeWords(str) {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function familyFactory() {
    const rawName =
        faker.word.adjective() + " " + faker.animal.type() + " Family";

    return {
        name: capitalizeWords(rawName),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

module.exports = familyFactory;
