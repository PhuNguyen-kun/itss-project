"use strict";

const { Model } = require("sequelize");
const { generateSlugFromName } = require("../src/utils/hasSlug");

module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Ingredient.hasMany(models.DishIngredient, {
                foreignKey: "ingredient_id",
                as: "dish_ingredients",
            });
            Ingredient.hasMany(models.Cart, {
                foreignKey: "ingredient_id",
                as: "carts",
            });
            Ingredient.hasMany(models.Fridge, {
                foreignKey: "ingredient_id",
                as: "fridges",
            });
        }
    }
    Ingredient.init(
        {
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
            image_url: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Ingredient",
            tableName: "ingredients",
            timestamps: true,
            paranoid: true,
            hooks: {
                beforeCreate: (ingredient) => {
                    ingredient.slug = generateSlugFromName(ingredient.name);
                },
                beforeUpdate: (ingredient) => {
                    if (ingredient.changed("name")) {
                        ingredient.slug = generateSlugFromName(ingredient.name);
                    }
                },
            },
        }
    );
    return Ingredient;
};
