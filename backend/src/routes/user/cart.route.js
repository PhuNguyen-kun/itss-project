// routes/cart.route.js
const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/user/cart.controller");
const authMiddleware = require("../../middlewares/auth.middleware");


router.post("/", authMiddleware.verifyToken, cartController.createCart);
router.get("/", authMiddleware.verifyToken, cartController.getCart);
router.put("/:id", authMiddleware.verifyToken, cartController.updateCart);
router.delete("/:id", authMiddleware.verifyToken, cartController.deleteCart);
module.exports = router;
