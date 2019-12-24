"use strict";

module.exports = app => {
  const express = require("express");
  const router = require("express").Router();
  const articles = require("../controllers/article_controller");
  const chatrooms = require("../controllers/chatroom_controller");
  const chatMessages = require("../controllers/chatMessages_controller");
  const users = require("../controllers/user_controller");
  const auth = require("../controllers/auth_controller");

  router.get("/", function(req, res) {
    res.json({
      message: "RESTapi service"
    });
  });

  router.get("/articles", auth.checkauth, articles.getArticles);
  router.get("/articles/:id", auth.checkauth, articles.getArticleById);
  router.post("/articles", auth.checkauth, articles.createArticle);
  router.put("/articles/:id", auth.checkauth, articles.updateArticle);
  router.delete("/articles/:id", auth.checkauth, articles.deleteArticle);

  router.get("/chatrooms", auth.checkauth, chatrooms.getChatrooms);
  router.get("/chatroomById/:id", auth.checkauth, chatrooms.getChatroomById);
  router.post("/chatrooms", auth.checkauth, chatrooms.createChatroom);
  router.put("/chatrooms/:id", auth.checkauth, chatrooms.updateChatroom);
  router.delete("/chatrooms/:id", auth.checkauth, chatrooms.deleteChatroom);
  router.post("/memberToGroup", auth.checkauth, chatrooms.addMemberToGroup);
  router.delete("/memberInGroup", auth.checkauth, chatrooms.deleteMemberInGroup);

  router.get("/chatMessages", auth.checkauth, chatMessages.getChatMessages);
  router.get("/chatMessages/:chatroomId", auth.checkauth, chatMessages.getChatMessagesByChatroomId);
  router.get("/chatMessageById/:id", auth.checkauth, chatMessages.getChatMessageById);
  router.post("/chatMessages", auth.checkauth, chatMessages.createChatMessage);
  router.put("/chatMessages/:id", auth.checkauth, chatMessages.updateChatMessage);
  // router.delete("/chatMessages/:id", auth.checkauth, chatMessages.deleteChatMessage);

  router.get("/users", auth.checkauth, users.getUsers);
  router.get("/userById/:id", auth.checkauth, users.getUserById);
  // router.post("/users", auth.checkauth, users.createUser);
  // router.put("/users/:id", auth.checkauth, users.updateUser);
  // router.delete("/users/:id", auth.checkauth, users.deleteUser);

  router.post("/register", auth.register);
  router.post("/login", auth.login);
  router.get("/confirmation/:token", auth.emailConfirmation, auth.showHome);

  return router;
};
