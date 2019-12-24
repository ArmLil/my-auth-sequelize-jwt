"use strict";
module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      message: DataTypes.TEXT,
      creatorId: DataTypes.UUID,
      chatroomId: DataTypes.UUID
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "chatMessages"
    }
  );
  ChatMessage.associate = function(models) {
    ChatMessage.belongsTo(models.User, {
      as: "creator",
      targetKey: "id",
      foreignKey: "creatorId"
    });
    ChatMessage.belongsTo(models.Chatroom, {
      as: "chatroom",
      targetKey: "id",
      foreignKey: "chatroomId"
    });
  };
  return ChatMessage;
};
