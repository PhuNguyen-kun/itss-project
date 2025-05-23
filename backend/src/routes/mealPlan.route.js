const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlan.controller');

router.get('/', mealPlanController.getMealPlan);
router.post('/', mealPlanController.addToMealPlan);

module.exports = router;
