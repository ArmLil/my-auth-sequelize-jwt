"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: "Email address already in use!"
        }
      },
      password: DataTypes.TEXT,
      email_confirmed: DataTypes.BOOLEAN
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: "users"
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Article, {
      as: "articles",
      foreignKey: "user_id"
    });
  };
  return User;
};
