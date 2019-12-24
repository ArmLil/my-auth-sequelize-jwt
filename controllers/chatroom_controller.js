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
    if (!req.params.id) return res.json({errorMessage: "req.params.id is required"})
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

    if (req.user) {
      creator = req.user.data;
      creatorId = creator.id;
    } else {
      return res.json({errorMessage: 'req.user is required'})
    }

    if (req.body.chat_type) {
      chat_type = req.body.chat_type;
    } else {
      return res.json({errorMessage: "chat_type is required in body"})
    }

    if (chat_type == "group") {
      if (!req.body.name) {
        return res.json({ errorMessage: "name is required in body" });
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
    if (!req.params.id) return res.json({errorMessage: "req.params.id is required"})

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
        errorMessage: 'Chatroom type should be "group"'
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
    if (!req.params.id) return res.json({errorMessage: "req.params.id is required"})
    const chatroom = await db.Chatroom.findByPk(req.params.id);
    if (!chatroom) {
      return res.json({ errorMessage: "Chatroom by this id is not found!" });
    }

    if (chatroom.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can delete the chatroom"
      });

    if (chatroom.chat_type !== "group")
      return res.json({
        errorMessage: 'Chatroom type should be "group" or "pairs"'
      });

    const members_chatrooms = await db.MembersChatrooms.findAndCountAll({
      where: {
        chatroomId: chatroom.id
      }
    });

    let members_chatrooms_ids = [];

    members_chatrooms.rows.forEach(mem_chat => {
      members_chatrooms_ids.push(mem_chat.id);
    });

    db.MembersChatrooms.destroy({ where: { id: members_chatrooms_ids } });

    await chatroom.destroy();

    res.json({
      chatroom,
      massage: `chatroom ${chatroom.name}, ${chatroom.id} is deleted`
    });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

async function addMemberToGroup(req, res) {
  console.log("function memberToGroup");
  try {
    if (!req.body.chatroomId)
      return res.json({ errorMessage: " chatroomId is required in body" });
    if (!req.body.memberId)
      return res.json({ errorMessage: " memberId is required in body" });
    const { chatroomId, memberId } = req.body;

    const chatroom = await db.Chatroom.findByPk(chatroomId);
    if (!chatroom) {
      return res.json({
        errorMessage: `Chatroom by id = ${chatroomId} is not found`
      });
    }

    const member = await db.User.findByPk(memberId);
    if (!member) {
      return res.json({
        errorMessage: `Member by id = ${memberId} is not found`
      });
    }

    if (chatroom.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can add a member to the chatroom"
      });

    if (chatroom.chat_type !== "group")
      return res.json({
        errorMessage: 'Chatroom type should be "group"'
      });

    const membersChatroom = await db.MembersChatrooms.findOrCreate({
      where: {
        memberId: memberId,
        chatroomId: chatroomId,
        memberName: member.username,
        chatroomName: chatroom.name
      }
    });

    res.json(membersChatroom);
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

async function deleteMemberInGroup(req, res) {
  console.log("function deleteMemberInGroup");
  try {
    if (!req.body.chatroomId)
      return res.json({ errorMessage: " chatroomId is required in body" });
    if (!req.body.memberId)
      return res.json({ errorMessage: " memberId is required in body" });
    const { chatroomId, memberId } = req.body;

    const chatroom = await db.Chatroom.findByPk(chatroomId);
    if (!chatroom) {
      return res.json({
        errorMessage: `Chatroom by id = ${chatroomId} is not found`
      });
    }

    const member = await db.User.findByPk(memberId);
    if (!member) {
      return res.json({
        errorMessage: `Member by id = ${memberId} is not found`
      });
    }

    if (chatroom.creatorId !== req.user.data.id)
      return res.json({
        errorMessage: "Only creator can delete a member from the chatroom"
      });

    if (chatroom.chat_type !== "group")
      return res.json({
        errorMessage: 'Chatroom type should be "group"'
      });

    const membersChatroom = await db.MembersChatrooms.findOne({
      where: {
        memberId: memberId,
        chatroomId: chatroomId,
        memberName: member.username,
        chatroomName: chatroom.name
      }
    });

    const deletedMember = await membersChatroom.destroy();

    return res.json(deletedMember);
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getChatrooms,
  getChatroomById,
  createChatroom,
  updateChatroom,
  deleteChatroom,
  addMemberToGroup,
  deleteMemberInGroup
};
