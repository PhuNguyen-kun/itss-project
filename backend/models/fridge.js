"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Fridge extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Fridge.belongsTo(models.Family, {
                foreignKey: "family_id",
                as: "family",
            });
            Fridge.belongsTo(models.Ingredient, {
                foreignKey: "ingredient_id",
                as: "ingredient",
            });
        }
    }
    Fridge.init(
        {
            family_id: DataTypes.BIGINT,
            ingredient_id: DataTypes.BIGINT,
            quantity: DataTypes.INTEGER,
            unit: DataTypes.SMALLINT,
        },
        {
            sequelize,
            modelName: "Fridge",
            tableName: "fridges",
            timestamps: true,
            paranoid: true,
        }
    );
    return Fridge;
};
