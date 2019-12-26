"use strict";
module.exports = (sequelize, DataTypes) => {
  const User_chatroom_numberOfUnreadMessages = sequelize.define(
    "User_chatroom_numberOfUnreadMessages",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      memberId: DataTypes.UUID,
      chatroomId: DataTypes.UUID,
      memberName: DataTypes.STRING,
      chatroomName: DataTypes.STRING,
      lastChatMessageId: {
        type: DataTypes.UUID
      },
      numberOfUnreadMessages: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "users_chatrooms_numberOfUnreadMessages"
    }
  );
  User_chatroom_numberOfUnreadMessages.associate = function(models) {
    // associations can be defined here
  };
  return User_chatroom_numberOfUnreadMessages;
};
