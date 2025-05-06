const { faker } = require("@faker-js/faker");
const { generateSlugFromName } = require("../src/utils/hasSlug");

function dishFactory() {
    const name = faker.commerce.productName();
    return {
        name,
        slug: generateSlugFromName(name),
        image_url: faker.image.avatar(),
        description: faker.lorem.sentences(2),
        instructions: faker.lorem.paragraphs(2),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

module.exports = dishFactory;
