"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class MealPlan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            MealPlan.belongsTo(models.Family, {
                foreignKey: "family_id",
                as: "family",
            });
            MealPlan.belongsTo(models.Dish, {
                foreignKey: "dish_id",
                as: "dish",
            });
            MealPlan.hasMany(models.Cart, {
                foreignKey: "meal_plan_id",
                as: "carts",
            });
        }
    }
    MealPlan.init(
        {
            family_id: DataTypes.BIGINT,
            dish_id: DataTypes.BIGINT,
            date: DataTypes.DATE,
            meal_type: DataTypes.SMALLINT,
        },
        {
            sequelize,
            modelName: "MealPlan",
            tableName: "meal_plans",
            timestamps: true,
            paranoid: true,
        }
    );
    return MealPlan;
};
