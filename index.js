"use strict";

var express = require("express");
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

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


app.get('/', function (req, res) {
  console.log('app.get(/)');
  res.sendFile(__dirname + '/index.html');
});

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


// io.on('connection', function (socket) {
//   console.log('user connected...');
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log('this is on server side', data);
//   });
//   socket.on("disconnect", ()=>{
//     console.log("Disconnected")
//   })
// });

const port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log(`server listening on port ${port}`);
  // db.sequelize.sync();
});
