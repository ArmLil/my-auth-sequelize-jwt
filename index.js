"use strict"

var express = require('express');
var app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
//Import routes
let api = require("./routes/api")()
var db = require('./models');

// Log requests to the console.
logger.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(logger(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error("Not Found!");
    err.status = 404;
    next(err);
});

// // error handler
// app.use(function (err, req, res) {
//     // set locals, only providing error in development
//     console.error(err);
//     console.error(req.body);
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.json({
//         message: res.locals.message,
//         status: res.locals.error.status,
//         success: false
//     });
// });


app.listen(3000, function() {
  db.sequelize.sync();
});
