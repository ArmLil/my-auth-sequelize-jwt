"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "users_chatrooms_numberOfUnreadMessages",
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        memberId: {
          type: Sequelize.UUID
        },
        chatroomId: {
          type: Sequelize.UUID
        },
        memberName: {
          type: Sequelize.STRING
        },
        chatroomName: {
          type: Sequelize.STRING
        },
        numberOfUnreadMessages: {
          type: Sequelize.INTEGER
        },
        lastChatMessageId: {
          type: Sequelize.UUID
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users_chatrooms_numberOfUnreadMessages");
  }
};
