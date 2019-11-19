"use strict"

module.exports = (app) => {

  const express = require("express");
  const router = require('express').Router();
  const users = require('../controllers/user_controller');
  // const auth = require("../controllers/auth_controller");


  router.get("/", function (req, res) {
      res.json({
          message: "RESTapi service"
      });
  });

  // router.post("/signin", auth.signin);
  // router.post("/check_token", auth.check_token);
  // router.get("/current_user", auth.check, auth.current_user);

  router.get("/users", users.getUsers);
  // router.get("/users/:id", users.getUserById);
  router.post("/users", users.registerUser);
  // router.put("/users/:id", users.updateUser);
  // router.delete("/users/:id", users.deleteUser);

  return router;
};
