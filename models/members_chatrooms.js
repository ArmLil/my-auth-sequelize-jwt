"use strict";
module.exports = (sequelize, DataTypes) => {
  const MembersChatrooms = sequelize.define(
    "MembersChatrooms",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      memberId: DataTypes.UUID,
      chatroomId: DataTypes.UUID,
      memberName: {
        type: DataTypes.STRING
      },
      chatroomName: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      tableName: "members_chatrooms"
    }
  );
  MembersChatrooms.associate = function(models) {
    // associations can be defined here
  };
  return MembersChatrooms;
};
