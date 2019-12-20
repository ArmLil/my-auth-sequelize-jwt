"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("members_chatrooms", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      memberId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      chatroomId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      memberName: {
        type: Sequelize.STRING
      },
      chatroomName: {
        type: Sequelize.STRING
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
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("members_chatrooms");
  }
};
