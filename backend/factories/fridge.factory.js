function fridgeFactory(familyIds = [], ingredientIds = []) {
    return {
        family_id: randomFromArray(familyIds),
        ingredient_id: randomFromArray(ingredientIds),
        quantity: Math.floor(Math.random() * 5) + 1,
        unit: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = fridgeFactory;
