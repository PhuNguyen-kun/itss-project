const { DishIngredient, Ingredient } = require("../../../models");
const { Op } = require('sequelize');

// API để lấy danh sách ingredients theo dish_id
exports.getIngredientsByDishId = async (dishId, options = {}) => {
    const queryOptions = {
        where: {
            dish_id: dishId,
        },
        include: [
            {
                model: Ingredient,
                as: 'ingredient',
                attributes: ['id', 'name', 'slug', 'image_url'],
            },
        ],
        attributes: ['quantity', 'unit', 'price'],
        order: [['price', 'ASC']], // Sắp xếp theo giá tăng dần
    };

    // Thêm bộ lọc price nếu được cung cấp
    if (options.minPrice && options.maxPrice) {
        queryOptions.where.price = {
            [Op.between]: [options.minPrice, options.maxPrice],
        };
    } else if (options.minPrice) {
        queryOptions.where.price = {
            [Op.gte]: options.minPrice,
        };
    } else if (options.maxPrice) {
        queryOptions.where.price = {
            [Op.lte]: options.maxPrice,
        };
    }

    return await DishIngredient.findAll(queryOptions);
};