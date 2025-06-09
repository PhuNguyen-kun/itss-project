// services/cart.service.js
const { Cart, Ingredient } = require("../../../models");

/**
 * Lấy giỏ hàng của user
 * @param {number} userId
 * @returns {Promise<Array>} Danh sách carts
 */
const getUserCart = async (userId) => {
  return await Cart.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Ingredient,
        as: "ingredient",
        attributes: ["id", "name", "slug", "image_url"],
      },
    ],
  });
};

/**
 * Tạo mới cart item
 * @param {number} userId
 * @param {Object} data
 * @returns {Promise<Object>} cart item mới
 */
const createCart = async (userId, data) => {
  const { ingredient_id, quantity, unit } = data;

  const cart = await Cart.create({
    user_id: userId,
    ingredient_id,
    quantity,
    unit,
    status: 0, // hoặc giá trị mặc định khác
  });

  return cart;
};

/**
 * Cập nhật cart item
 * @param {number} userId
 * @param {number} cartId
 * @param {Object} data
 * @returns {Promise<Object|null>} cart item đã cập nhật hoặc null nếu không tìm thấy
 * @returns {Promise<boolean>} true nếu xoá thành công, false nếu không tìm thấy
 */
const updateCart = async (userId, cartId, data) => {
  const { quantity, unit } = data;

  const cart = await Cart.findOne({
    where: {
      id: cartId,
      user_id: userId,
    },
  });

  if (!cart) {
    return null; // Không tìm thấy cart hoặc không thuộc user
  }

  cart.quantity = quantity;
  cart.unit = unit;
  await cart.save();

  return cart;
};

const deleteCart = async (userId, cartId) => {
    const cart = await Cart.findOne({
      where: {
        id: cartId,
        user_id: userId,
      },
    });
  
    if (!cart) {
      return false; // Không tìm thấy hoặc không thuộc user
    }
  
    await cart.destroy();
    return true;
  };
module.exports = {
  getUserCart,
  createCart,
  updateCart,
  deleteCart,
};
