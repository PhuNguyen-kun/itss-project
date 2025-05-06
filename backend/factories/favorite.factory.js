function favoriteFactory(userIds = [], dishIds = []) {
    return {
        user_id: randomFromArray(userIds),
        dish_id: randomFromArray(dishIds),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = favoriteFactory;
