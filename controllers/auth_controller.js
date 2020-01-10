let db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailSender = require("./email_notification_controller");
const saltRounds = 10;
// 60 * 60 * 24 = 1 day
const expireTime = 60 * 60 * 24 * 5;

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

            emailSender(user.dataValues, req.headers.host, token, result => {
              if (result.errorMessage) {
                res.json(result);
              } else {
                res.json({ data: { user, token, message: result.message } });
              }
            });
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

async function register(req, res) {
  console.log("function registerUser");
  try {
    const findUserByUsername = await db.User.findOne({
      where: { username: req.body.username }
    });
    if (findUserByUsername) {
      return res
        .status(403)
        .json({ errorMessage: "User with this username already exists!" });
    }

    const findUserByEmail = await db.User.findOne({
      where: { email: req.body.email }
    });
    if (findUserByEmail) {
      return res
        .status(403)
        .json({ errorMessage: "User with this email already exists!" });
    }

    const user = await db.User.findOrCreate({
      where: { username: req.body.username, email: req.body.email },
      defaults: {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds)
      }
    });

    const { id, username, email, email_confirmed } = user[0].dataValues;
    let token = jwt.sign(
      {
        data: {
          id,
          username,
          email,
          email_confirmed
        }
      },
      process.env.TOKEN_SECRET,
      { expiresIn: expireTime }
    );

    await delete user[0].dataValues.password;

    // to disable email confirmation comment these emailSender part and then
    // discomment res.json({ data: { user, token }});

    await emailSender(user[0].dataValues, req.headers.host, token, result => {
      if (result.errorMessage) {
        return res.status(403).json(result);
      } else {
        res.json({ data: { user, token, message: result.message } });
      }
    });

    // res.json({ data: { user, token }});
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function login(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(403).json({
      errorMessage: "Email or password is not provided"
    });
  }

  try {
    const user = await db.User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(403).json({
        errorMessage: "User with this email does not exist"
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
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
        { expiresIn: expireTime }
      );

      if (!user.email_confirmed) {
        // to disable email confirmation discomment next 3 lines of code

        // req.user = decoded;
        // console.log("Token is valid", decoded);
        // return next();

        emailSender(user.dataValues, req.headers.host, token, result => {
          if (result.errorMessage) {
            return res.json(result);
          } else {
            return res.json({ data: { user, token, message: result.message } });
          }
        });
      } else {
        return res.status(200).json({
          data: { token }
        });
      }
    } else {
      return res.status(403).json({
        errorMessage: "Password is not valid"
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      errorMessage: error.message
    });
  }
}

function emailConfirmation(req, res, next) {
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
          if (!user)
            res.status(403).json({ errorMessage: "user is not found" });
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
            { expiresIn: expireTime }
          );
          delete user.dataValues.password;
          next();
          // res.render('home', {user})
          // res.json({ data: { user, message: "email is confirmed", token } });
        })
        .catch(error => {
          console.error("Opps", error);
          res.json({ errorMessage: error });
        });
    }
  });
}

function showHome(req, res) {
  res.statusCode = 302;
  res.setHeader("Location", "http://localhost:4200/overview");
  res.end();
}

module.exports = {
  register,
  login,
  checkauth,
  emailConfirmation,
  showHome
};
