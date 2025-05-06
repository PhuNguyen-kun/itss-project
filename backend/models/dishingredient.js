"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DishIngredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            DishIngredient.belongsTo(models.Dish, {
                foreignKey: "dish_id",
                as: "dish",
            });
            DishIngredient.belongsTo(models.Ingredient, {
                foreignKey: "ingredient_id",
                as: "ingredient",
            });
        }
    }
    DishIngredient.init(
        {
            dish_id: DataTypes.BIGINT,
            ingredient_id: DataTypes.BIGINT,
            price: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            unit: DataTypes.SMALLINT,
        },
        {
            sequelize,
            modelName: "DishIngredient",
            tableName: "dishes_ingredients",
            timestamps: true,
            paranoid: true,
        }
    );
    return DishIngredient;
};
