"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Family extends Model {
        static associate(models) {
            Family.hasMany(models.User, {
                foreignKey: "family_id",
                as: "users",
            });
            Family.hasMany(models.MealPlan, {
                foreignKey: "family_id",
                as: "meal_plans",
            });
            Family.hasMany(models.Fridge, {
                foreignKey: "family_id",
                as: "fridges",
            });
        }
    }
    Family.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Family",
            tableName: "families",
            timestamps: true,
            paranoid: true,
        }
    );
    return Family;
};
