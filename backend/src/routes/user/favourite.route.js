const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/user/favourite.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

// Lấy tất cả favorites
router.get('/', favoriteController.getAllFavorites);

// Lấy favorites theo user_id → cần đăng nhập
router.get('/user/:user_id', verifyToken, favoriteController.getFavoritesByUserId);

module.exports = router;
