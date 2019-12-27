"use strict";

let db = require("../models");

async function getNotifications(req, res) {
  try {
    if (!req.params.chatroomId) {
      return res.json({ errorMessage: "req.params.chatroomId is required" });
    }

    if (!req.user) {
      return res.json({ errorMessage: "req.user is required" });
    }

    const notificationsOfUnreadMessages = await db.User_chatroom_numberOfUnreadMessages.findAll(
      {
        where: {
          memberId: req.user.data.id,
          chatroomId: req.params.chatroomId
        }
      }
    );

    res.json({ notificationsOfUnreadMessages });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

module.exports = {
  getNotifications
};
