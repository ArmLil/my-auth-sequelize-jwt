let db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailSender = require("./email_notification_controller");

function checkauth(req, res, next) {
  let token =
    req.body.token ||
    req.query.token ||
    req.headers["x-auth"] ||
    req.headers["x-access-token"];

  // Get auth header value if it is bearer
  const bearerHeader = req.headers["authorization"];

  if (bearerHeader) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    token = bearerToken;
  }
  if (!token) {
    return res
      .status(403)
      .json({ success: false, errorMessage: "Token is not provided" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    if (err) {
      console.error(err);
      return res.status(403).json({
        errorMessage: err.message
      });
    } else {
      db.User.findOne({
        where: {
          id: decoded.data.id
        }
      })
        .then(user => {
          if (!user) {
            return res
              .status(403)
              .json({ errorMessage: "User with this token does not exist" });
          } else if (!user.email_confirmed) {
            // to disable email confirmation discomment next 3 lines of code

            // req.user = decoded;
            // console.log("Token is valid", decoded);
            // return next();

            emailSender(user, req.headers.host, token);
            return res
              .status(403)
              .json({ errorMessage: "Email is not confirmed" });
          } else {
            req.user = decoded;
            console.log("Token is valid", decoded);
            return next();
          }
        })
        .catch(error => {
          console.error("Opps", error);
          res.json({
            errorMessage: error
          });
        });
    }
  });
}

// to disable the auth for all the endpoints comment the
// previous function checkauth and discomment this fake checkauth
// function checkauth(req, res, next) {
//   next()
// }

async function login(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    res.status(403).json({
      errorMessage: "Username or password is not provided"
    });
  }

  try {
    const user = await db.User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      res.status(403).json({
        errorMessage: "User with this username does not exist"
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        // expiresIn: 60 * 60 * 24 = 1 day
        let token = jwt.sign(
          {
            data: {
              id: user.id,
              username: user.username,
              email: user.email,
              email_confirmed: user.email_confirmed
            }
          },
          process.env.TOKEN_SECRET,
          { expiresIn: 60 * 60 * 24 }
        );
        res.status(200).json({
          data: { token }
        });
      } else {
        res.status(403).json({
          errorMessage: "Password is not valid"
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

function emailConfirmation(req, res) {
  console.log("function emailConfirmation");

  jwt.verify(req.params.token, process.env.TOKEN_SECRET, function(
    err,
    decoded
  ) {
    if (err) {
      console.error(err);
      return res.status(403).json({
        errorMessage: err.message
      });
    } else {
      db.User.findByPk(decoded.data.id)
        .then(user => {
          if (!user) res.json({ errorMessage: "user is not found" });
          user.email_confirmed = true;
          user.save(user);
          let token = jwt.sign(
            {
              data: {
                id: user.id,
                username: user.username,
                email: user.email,
                email_confirmed: user.email_confirmed
              }
            },
            process.env.TOKEN_SECRET,
            { expiresIn: 60 * 60 * 24 }
          );
          delete user.dataValues.password;
          res.json({ data: { user, message: "email is confirmed", token } });
        })
        .catch(error => {
          console.error("Opps", error);
          res.json({ errorMessage: error });
        });
    }
  });
}

module.exports = {
  login: login,
  checkauth: checkauth,
  emailConfirmation: emailConfirmation
};
