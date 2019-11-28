"use strict";

let db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function getUsers(req, res) {
  console.log("function getUsers");
  try {
    let users = await db.User.findAndCountAll({
      include: [
        {
          model: db.Article,
          as: "articles"
        }
      ]
    });

    users = users.rows.map(user => {
      delete user.dataValues.password;
      return user;
    });

    res.json({
      users: users.rows,
      count: users.count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getUserById(req, res) {
  console.log("function getUserById");
  try {
    let user = await db.User.findByPk(req.params.id, {
      include: [
        {
          model: db.Article,
          as: "articles"
        }
      ]
    });

    delete user.dataValues.password;
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function registerUser(req, res) {
  console.log("function registerUser");
  try {
    //check username
    //do not let user to create his username with a username which already exists
    const findUserByUsername = await db.User.findOne({
      where: { username: req.body.username }
    });
    if (findUserByUsername) {
      throw new Error(
        "validationError: User with this username already exists!"
      );
    }

    //check email
    //do not let user to update his email with an email which already exists
    const findUserByEmail = await db.User.findOne({
      where: { email: req.body.email }
    });
    if (findUserByEmail) {
      throw new Error("validationError: User with this email already exists!");
    }

    const user = await db.User.findOrCreate({
      where: { username: req.body.username, email: req.body.email },
      defaults: {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds)
      }
    });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateUser(req, res) {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user)
      throw new Error("validationError: User by this id is not found!");

    //check username
    //do not let user to update his username with a username which already exists
    const findUserByUsername = await db.User.findOne({
      where: { username: req.body.username }
    });
    if (user.username !== req.body.username && findUserByUsername) {
      console.log("findUserByUsername=", findUserByUsername.toJSON());
      throw new Error(
        "validationError: User with this username already exists!"
      );
    }

    //check email
    //do not let user to update his email with an email which already exists
    const findUserByEmail = await db.User.findOne({
      where: { email: req.body.email }
    });
    if (user.email !== req.body.email && findUserByEmail) {
      throw new Error("validationError: User with this email already exists!");
    }

    user.username = req.body.username;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, saltRounds);
    }

    await user.save({ username: req.body.username, email: req.body.email });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteUser(req, res) {
  console.log("function deleteUsers");
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user)
      throw new Error("validationError: User by this id is not found!");
    await user.destroy();
    res.json({
      massage: `user ${user.username}, ${user.email}, ${user.id} is deleted`
    });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  registerUser: registerUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
