const express = require('express');
const router = express.Router();
const {
  getAllDishes,
  getIngredientsByDishId,
} = require('../controllers/dishController');

// Route lấy danh sách món
router.get('/', getAllDishes);

// Route lấy nguyên liệu theo dish_id
router.get('/:dishId/ingredients', getIngredientsByDishId); 

module.exports = router;

