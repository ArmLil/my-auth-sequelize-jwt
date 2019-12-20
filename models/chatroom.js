"use strict";
module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define(
    "Chatroom",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      creatorId: {
        type: DataTypes.UUID,
        autoIncrement: false
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: "common"
      },
      chat_type: {
        type: DataTypes.STRING,
        defaultValue: "general"
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "chatrooms"
    }
  );
  Chatroom.associate = function(models) {
    Chatroom.belongsToMany(models.User, {
      through: "MembersChatrooms",
      as: "members",
      foreignKey: "chatroomId",
      otherKey: "memberId"
    });
    // Chatroom.hasMany(models.User, {
    //   through: "MembersChatrooms",
    //   as: "members",
    //   foreignKey: "chatroomId",
    //   otherKey: "memberId"
    // });
    Chatroom.belongsTo(models.User, {
      as: "creator",
      targetKey: "id",
      foreignKey: "creatorId"
    });
  };
  return Chatroom;
};
