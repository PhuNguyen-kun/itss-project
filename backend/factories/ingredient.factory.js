const { faker } = require("@faker-js/faker");
const { generateSlugFromName } = require("../src/utils/hasSlug");

function ingredientFactory() {
    const name = faker.commerce.product();
    return {
        name,
        slug: generateSlugFromName(name),
        image_url: faker.image.avatar(),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

module.exports = ingredientFactory;
