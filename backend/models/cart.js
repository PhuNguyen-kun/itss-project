"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Cart.belongsTo(models.MealPlan, {
                foreignKey: "meal_plan_id",
                as: "meal_plan",
            });
            Cart.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
            Cart.belongsTo(models.Ingredient, {
                foreignKey: "ingredient_id",
                as: "ingredient",
            });
        }
    }
    Cart.init(
        {
            meal_plan_id: DataTypes.BIGINT,
            user_id: DataTypes.BIGINT,
            ingredient_id: DataTypes.BIGINT,
            quantity: DataTypes.INTEGER,
            unit: DataTypes.SMALLINT,
            status: DataTypes.INTEGER,
            completed_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Cart",
            tableName: "carts",
            timestamps: true,
            paranoid: true,
        }
    );
    return Cart;
};
