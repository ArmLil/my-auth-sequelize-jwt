"use strict";

let db = require("../models");

async function getChatMessages(req, res) {
  console.log("function getChatMessages");
  try {
    let chatMessages = await db.ChatMessage.findAndCountAll();
    res.json({
      chatMessages
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getChatMessagesByChatroomId(req, res) {
  console.log("function getChatMessagesByChatroomId");
  if(!req.params.chatroomId) {
    return res.json({errorMessage: "req.params.chatroomId is required"})
  }
  try {
    let chatMessages = await db.ChatMessage.findAndCountAll({
      where: {
        chatroomId: req.params.chatroomId
      }
    });
    res.json({
      chatMessages
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getChatMessageById(req, res) {
  console.log("function getChatMessageById");
  try {

    if (!req.params.id) return res.json({errorMessage: "req.params.id is required"})
    let chatMessage = await db.ChatMessage.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: { exclude: ["password", "deletedAt"] }
        },
        {
          model: db.Chatroom,
          as: "chatroom"
        }
      ]
    });

    if (!chatMessage) {
      throw new Error("ChatMessage with this id is not found");
    }

    res.json({ chatMessage });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createChatMessage(req, res) {
  console.log("function createChatMessage");

  try {
    let message;
    let chatroomId;
    let creatorId;
    let creator;

    if (req.user) {
      creator = req.user.data;
      creatorId = creator.id;
    } else {
      return res.json({errorMessage: 'req.user is required'})
    }

    if (req.body.chatroomId) {
      chatroomId = req.body.chatroomId;
    } else {
      return res.json({errorMessage: 'chatroomId is required in body'})
    }

    if (req.body.message) {
      message = req.body.message;
    } else {
      return res.json({errorMessage: 'message is required in body'})
    }

    //check if creator is a chatroom member
    const memberChatroom = await db.MembersChatrooms.findOne({
      where: {
        memberId: creatorId,
        chatroomId: chatroomId
      }
    })

    if (!memberChatroom) {
      return res.json({errorMessage: " Only member can add a chatMessage"})
    }

    const chatroom = await db.Chatroom.findByPk(chatroomId)
    if (!chatroom) {
      return res.json({ errorMessage: `chatroom by id ${chatroomId} is not found` });
    }

      const chatMessage = await db.ChatMessage.findOrCreate({
        where: {
          message,
          chatroomId,
          creatorId
        }
      });

    res.json({ chatMessage });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateChatMessage(req, res) {
  console.log("function updateChatMessage");
  try {
    if (!req.params.id) return res.json({errorMessage: "req.params.id is required"})

    const chatMessage = await db.ChatMessage.findByPk(req.params.id);

    if (!chatMessage)
      return res.json({
        errorMessage: "ChatMessage by this id is not found"
      });

    if (chatMessage.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can update the chatMessage"
      });

    if (req.body.message) {
      chatMessage.message = req.body.message;
    } else {
      return res.json({errorMessage: 'message is required in body'})
    }

    await chatMessage.save();
    res.json({ chatMessage });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteChatMessage(req, res) {
  console.log("function deleteChatMessage");
  try {
    if (!req.params.id) return res.json({errorMessage: "req.params.id is required"})

    const chatMessage = await db.ChatMessage.findByPk(req.params.id);
    if (!chatMessage) {
      return res.json({ errorMessage: "ChatMessage by this id is not found!" });
    }

    if (chatMessage.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can delete the chatMessage"
      });

    await chatMessage.destroy();

    res.json({
      chatMessage,
      massage: `chatMessage "${chatMessage.message}", ${chatMessage.id} is deleted`
    });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}



module.exports = {
  getChatMessages,
  getChatMessagesByChatroomId,
  getChatMessageById,
  createChatMessage,
  updateChatMessage,
  deleteChatMessage
};
