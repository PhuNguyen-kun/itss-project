"use strict";

const { Model } = require("sequelize");
const { generateSlugFromName } = require("../src/utils/hasSlug");

module.exports = (sequelize, DataTypes) => {
    class Dish extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Dish.hasMany(models.Favorite, {
                foreignKey: "dish_id",
                as: "favorites",
            });
            Dish.hasMany(models.MealPlan, {
                foreignKey: "dish_id",
                as: "meal_plans",
            });
            Dish.hasMany(models.DishIngredient, {
                foreignKey: "dish_id",
                as: "dish_ingredients",
            });
        }
    }
    Dish.init(
        {
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
            image_url: DataTypes.STRING,
            description: DataTypes.TEXT,
            instructions: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Dish",
            tableName: "dishes",
            timestamps: true,
            paranoid: true,
            hooks: {
                beforeCreate: (dish) => {
                    dish.slug = generateSlugFromName(dish.name);
                },
                beforeUpdate: (dish) => {
                    if (dish.changed("name")) {
                        dish.slug = generateSlugFromName(dish.name);
                    }
                },
            },
        }
    );
    return Dish;
};
