let db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      .json({ success: false, errorMessage: "Token is not provided!" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      console.error(err);
      return res.status(403).json({
        errorMessage: err.message
      });
    } else {
      db.User.findOne({
        where: {
          email: decoded.data.email
        }
      })
        .then(user => {
          if (!user) {
            return res
              .status(403)
              .json({ errorMessage: "User with this token does not exist!" });
          } else {
            req.user = decoded;
            console.log("Token is valid!", decoded);
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
      errorMessage: "Имя пользователя или пароль отсутствуют"
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
        errorMessage: "Пользователя с таким именем не существует"
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        // expiresIn: 60 * 60 * 24 = 1 day
        let token = jwt.sign(
          { data: { username: user.username, email: user.email } },
          process.env.TOKEN_SECRET,
          { expiresIn: 60 * 60 * 24 }
        );
        res.status(200).json({
          data: { token }
        });
      } else {
        res.status(403).json({
          message: "Некорректный пароль"
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

module.exports = {
  login: login,
  checkauth: checkauth
};
