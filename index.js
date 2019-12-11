"use strict";

var express = require("express");
var app = express();
require("dotenv").config();
var exphbs  = require('express-handlebars');
const logger = require("morgan");
const bodyParser = require("body-parser");
//Import routes
let api = require("./routes/api")();
var db = require("./models");

// Log requests to the console.
logger.token("body", function(req, res) {
  return JSON.stringify(req.body);
});
app.use(
  logger(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/", api);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', 'public/views');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found!");
  err.status = 404;
  next(err);
});

app.listen(3000, function() {
  // db.sequelize.sync();
});
