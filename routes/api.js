"use strict"

module.exports = (app) => {

  const express = require("express");
  const router = require('express').Router();
  const users = require('../controllers/user_controller');
  const auth = require("../controllers/auth_controller");

  router.get("/", function (req, res) {
      res.json({
          message: "RESTapi service"
      });
  });

  // router.post("/signin", auth.signin);
  // router.post("/check_token", auth.check_token);
  // router.get("/current_user", auth.check, auth.current_user);

  router.get("/users", auth.checkauth, users.getUsers);
  router.get("/users/:id", auth.checkauth, users.getUserById);
  router.post("/users", auth.checkauth, users.registerUser);
  router.put("/users/:id", auth.checkauth, users.updateUser);
  router.delete("/users/:id", auth.checkauth, users.deleteUser);


  router.post("/login", auth.login);
  router.post("/checkToken", auth.checkToken);

  return router;
};
