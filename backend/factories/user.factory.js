const { faker } = require("@faker-js/faker");

function userFactory(familyIds = []) {
    return {
        full_name: faker.person.fullName(),
        email: faker.internet.email(),
        phone_number: faker.phone.number(),
        gender: faker.helpers.arrayElement([1, 2, 3]), // 1: male, 2: female, 3: other
        birth_date: faker.date.birthdate(),
        role: faker.helpers.arrayElement([1, 2]), // 1: admin, 2: user
        avatar_url: faker.image.avatar(),
        google_id: faker.string.uuid(),
        family_id: faker.helpers.arrayElement(familyIds),
        family_role: faker.helpers.arrayElement([1, 2]), // 1: housekeeper, 2: family member
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

module.exports = userFactory;
