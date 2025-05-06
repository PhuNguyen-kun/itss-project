"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Favorite extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Favorite.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
            Favorite.belongsTo(models.Dish, {
                foreignKey: "dish_id",
                as: "dish",
            });
        }
    }
    Favorite.init(
        {
            user_id: DataTypes.BIGINT,
            dish_id: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: "Favorite",
            tableName: "favorites",
            timestamps: true,
            paranoid: true,
        }
    );
    return Favorite;
};
