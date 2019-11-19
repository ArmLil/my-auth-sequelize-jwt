"use strict"

var express = require('express');
var app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
//Import routes
let api = require("./routes/api")()
var db = require('./models');

// Log requests to the console.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error("Not Found!");
    err.status = 404;
    next(err);
});


app.listen(3000, function() {
  // db.sequelize.sync();
});
