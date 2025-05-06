function dishIngredientFactory(dishIds = [], ingredientIds = []) {
    return {
        dish_id: randomFromArray(dishIds),
        ingredient_id: randomFromArray(ingredientIds),
        price: Math.floor(Math.random() * 5000) + 1000,
        quantity: Math.floor(Math.random() * 5) + 1,
        unit: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = dishIngredientFactory;
