// controllers/cart.controller.js
const cartService = require("../../services/user/cart.service");



exports.createCart = async (req, res) => {
    try {
      const userId = req.user.id; 
      const { ingredient_id, quantity, unit } = req.body;
  
      if (!ingredient_id || !quantity || !unit) {
        return res.status(400).json({
          message: "Missing required fields!"
        });
      }
  
      const cart = await cartService.createCart(userId, { ingredient_id, quantity, unit });
  
      res.status(201).json({
        status: "success",
        data: cart
      });
    } catch (error) {
      console.error("Create cart error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
    }
  };

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const carts = await cartService.getUserCart(userId);

    res.status(200).json({
      status: "success",
      data: carts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.updateCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const cartId = req.params.id;
      const { quantity, unit } = req.body;
  
      if (!quantity || !unit) {
        return res.status(400).json({
          message: "Missing required fields!"
        });
      }
  
      const updatedCart = await cartService.updateCart(userId, cartId, { quantity, unit });
  
      if (!updatedCart) {
        return res.status(404).json({
          message: "Cart not found or not belongs to you!"
        });
      }
  
      res.status(200).json({
        status: "success",
        data: updatedCart
      });
    } catch (error) {
      console.error("Update cart error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
    }
  };

  exports.deleteCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const cartId = req.params.id;
  
      const deleted = await cartService.deleteCart(userId, cartId);
  
      if (!deleted) {
        return res.status(404).json({
          message: "Cart not found or not belongs to you!"
        });
      }
  
      res.status(200).json({
        status: "success",
        message: "Cart deleted successfully!"
      });
    } catch (error) {
      console.error("Delete cart error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
    }
  };