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
      underscored: false,
      tableName: "users"
    }
  );
  User.associate = function(models) {
    User.hasMany(models.Article, {
      as: "articles",
      foreignKey: "userId"
    });
    User.hasMany(models.Chatroom, {
      as: "chatrooms",
      foreignKey: "creatorId"
    });
    User.belongsToMany(models.Chatroom, {
      through: "User_chatroom_numberOfUnreadMessages",
      as: "rooms_with_unread_messages",
      foreignKey: "memberId",
      otherKey: "chatroomId"
    });
    User.belongsToMany(models.Chatroom, {
      through: "MembersChatrooms",
      as: "rooms",
      foreignKey: "memberId",
      otherKey: "chatroomId"
    });
  };
  return User;
};
