const { Dish } = require('../../models');

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.findAll();
    res.json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const { DishIngredient, Ingredient } = require('../../models');

const getIngredientsByDishId = async (req, res) => {
  const { dishId } = req.params;
  try {
    const ingredients = await DishIngredient.findAll({
      where: { dish_id: dishId },
      include: [
        {
          model: Ingredient,
          as: 'ingredient',
          attributes: ['id', 'name', 'slug', 'image_url'], // chỉ lấy thông tin cần
        },
      ],
    });
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
    getAllDishes,
    getIngredientsByDishId, 
  };
  


