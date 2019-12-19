"use strict";

module.exports = function emailSender(user, host, token, cb) {
  console.log({ user }, { host }, { token });

  const nodemailer = require("nodemailer");
  const hbs = require("nodemailer-express-handlebars");
  const path = require("path");
  const config = require("../config/config.js");
  const url = "http://" + host + "/api/v1/confirmation/" + token;
  const { email } = config.development;

  let transporter = nodemailer.createTransport({
    host: email.host,
    port: email.port,
    auth: {
      user: email.auth.user,
      pass: email.auth.pass
    },
    secure: email.sequre
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve(__dirname, "../templates"),
        defaultLayout: false
      },
      viewPath: path.resolve(__dirname, "../public/views/")
    })
  );

  const mailOptions = {
    from: email.from, // Sender address
    to: user.email, // List of recipients
    // to: email.to,  // List of recipients
    subject: "Подтверждение электронного адреса", // Subject line
    text: "Подтверждение регистрации",
    template: "index",
    context: {
      user,
      url
    }
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return cb({ errorMessage: err.message });
    } else {
      console.log("info = ", info);
      return cb({
        message: "Check " + user.email + " for confirmation ",
        info
      });
    }
  });
};
