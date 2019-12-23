"use strict";

let db = require("../models");

async function getChatrooms(req, res) {
  console.log("function getChatrooms");
  try {
    let chatrooms = await db.Chatroom.findAndCountAll();
    res.json({
      chatrooms
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getChatroomById(req, res) {
  console.log("function getChatroomById");
  try {
    let chatroom = await db.Chatroom.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: "creator",
          attributes: { exclude: ["password", "deletedAt"] }
        },
        {
          model: db.User,
          as: "members",
          attributes: { exclude: ["password", "deletedAt"] }
        }
      ]
    });

    if (!chatroom) {
      throw new Error("Chatroom with this id is not found");
    }

    res.json({ chatroom });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createChatroom(req, res) {
  console.log("function createChatroom");

  try {
    let chat_type;
    let name;
    let receiverId;
    let chatroom;
    let creator;
    let creatorId;

    console.log("req.user = ", req.user);

    if (req.user) {
      creator = req.user.data;
      creatorId = creator.id;
    }

    if (req.body.chat_type) {
      chat_type = req.body.chat_type;
    }

    if (chat_type == "group") {
      if (!req.body.name) {
        return res.json({ errorMessage: "name is required" });
      }
      name = req.body.name;

      const chatrooms = await db.Chatroom.findAndCountAll();
      if (chatrooms.count !== 0) {
        const findChatroomByName = await db.Chatroom.findOne({
          where: { name: req.body.name }
        });
        if (findChatroomByName) {
          return res.json({
            errorMessage:
              "Chatroom with this name already exists in this type group"
          });
        }
      }

      chatroom = await db.Chatroom.findOrCreate({
        where: {
          name,
          chat_type,
          creatorId
        }
      });

      await db.MembersChatrooms.findOrCreate({
        where: {
          memberId: creatorId,
          chatroomId: chatroom[0].dataValues.id,
          memberName: creator.username,
          chatroomName: chatroom[0].dataValues.name
        }
      });
    } else if (chat_type == "pairs") {
      let findReceiver;
      if (!req.body.receiverId) {
        return res.json({ errorMessage: "receiverId is required" });
      }
      receiverId = req.body.receiverId;

      findReceiver = await db.User.findOne({
        where: {
          id: receiverId,
          attributes: { exclude: ["password"] }
        }
      });

      if (!findReceiver) {
        return res.json({
          errorMessage: "Receiver by this id is not found"
        });
      }

      chatroom = await db.Chatroom.findOrCreate({
        where: {
          name: `${creator.username}_${findReceiver.username}`,
          chat_type,
          creatorId
        }
      });
      // delete findReceiver.dataValues.password;
      chatroom[0].dataValues.receiver = findReceiver;

      await db.MembersChatrooms.findOrCreate({
        where: {
          memberId: creatorId,
          chatroomId: chatroom[0].dataValues.id,
          memberName: creator.username,
          chatroomName: chatroom[0].dataValues.name
        }
      });
      await db.MembersChatrooms.findOrCreate({
        where: {
          memberId: findReceiver.id,
          chatroomId: chatroom[0].dataValues.id,
          memberName: findReceiver.username,
          chatroomName: chatroom[0].dataValues.name
        }
      });
    } else
      return res.json({
        errorMessage:
          "chat_type is required and takes values only 'pairs' or 'group'"
      });

    chatroom[0].dataValues.creator = req.user.data;

    res.json({ chatroom });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateChatroom(req, res) {
  console.log("function updateChatroom");
  try {
    const chatroom = await db.Chatroom.findByPk(req.params.id);
    if (!chatroom)
      return res.json({
        errorMessage: "Chatroom by this id is not found"
      });

    if (chatroom.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can update the chatroom"
      });

    if (chatroom.chat_type !== "group")
      return res.json({
        errorMessage: 'Chatoom type should be "group"'
      });

    //check name
    //do not let the chatroom to be updated with a name which already exists
    const findChatroomByName = await db.Chatroom.findOne({
      where: { name: req.body.name }
    });

    if (req.body.name) {
      if (chatroom.name !== req.body.name && findChatroomByName) {
        return res.json("Chatroom with this name already exists");
      }
      chatroom.name = req.body.name;
    } else {
      return res.json({
        errorMessage: "Name is required"
      });
    }

    await chatroom.save();
    res.json({ chatroom });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteChatroom(req, res) {
  console.log("function deleteChatroom");
  try {
    const chatroom = await db.Chatroom.findByPk(req.params.id);
    console.log({ chatroom });
    if (!chatroom) {
      return res.json({ errorMessage: "Chatroom by this id is not found!" });
    }

    if (chatroom.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can delete the chatroom"
      });

    if (chatroom.chat_type !== "group")
      return res.json({
        errorMessage: 'Chatoom type should be "group" or "pairs"'
      });
    await chatroom.destroy();
    res.json({
      massage: `chatroom ${chatroom.name}, ${chatroom.id} is deleted`
    });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getChatrooms: getChatrooms,
  getChatroomById: getChatroomById,
  createChatroom: createChatroom,
  updateChatroom: updateChatroom,
  deleteChatroom: deleteChatroom
};