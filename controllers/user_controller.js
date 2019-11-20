"use strict"

let db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function getUsers(req, res) {
  console.log('function getUsers');
  db.User.findAndCountAll().then(function (users) {
      res.json({
          data: users.rows,
          count: users.count
      });
  }).catch(function (error) {
      console.error(error);
      res.json({
          message: error.message
      });
  });
}

function getUserById(req, res) {
  console.log('function getUserById');
  db.User.findByPk(req.params.id).then(function (user) {
      res.json({
          data: user
      });
  }).catch(function (error) {
      console.error(error);
      res.json({
          message: error.message
      });
  });
}

function registerUser(req, res) {
  console.log('function registerUser');
  //Hash passwords
  const saltRounds = 10;
  const hashPassword = bcrypt.hash(req.body.password, saltRounds);


  db.User.findOrCreate({
      where: {user_name: req.body.userName},
      defaults: {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, saltRounds)
      }
  }).spread(function (user, created) {
      res.json({
          data: user
      });
  }).catch(function (error) {
      console.error(error);
      res.json({
          message: error.message
      });
  });
}

// function updateUsers(req, res) {
//   console.log('function updateUsers');
//   res.send({"massage": 'function updateUsers'})
// }
//
// function deleteUsers(req, res) {
//   console.log('function deleteUsers');
//   res.send({"massage": 'function deleteUsers'})
// }

module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  registerUser: registerUser
  // updateUser: updateUser,
  // deleteUser: deleteUser
}
