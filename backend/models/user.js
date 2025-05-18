"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Family, {
                foreignKey: "family_id",
                as: "family",
            });
            User.hasMany(models.Favorite, {
                foreignKey: "user_id",
                as: "favorites",
            });
            User.hasMany(models.Cart, { foreignKey: "user_id", as: "carts" });
        }
    }
    User.init(
        {
            full_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            gender: DataTypes.SMALLINT,
            birth_date: DataTypes.DATE,
            role: DataTypes.SMALLINT,
            avatar_url: DataTypes.STRING,
            google_id: DataTypes.STRING,
            family_id: DataTypes.BIGINT,
            family_role: DataTypes.SMALLINT,
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: true,
            paranoid: true,
        }
    );
    return User;
};
