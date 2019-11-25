let db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



function checkauth(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-auth'] || req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({success: false, errorMessage: 'Токен отсутствует!'});
    }

    // Get auth header value if it is bearer
    const bearerHeader = req.headers['authorization'];

    console.log(req.headers);
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      token = bearerToken;
    }

    // jwt.verify(token, process.env.SECRET, function (err, decoded) {
    jwt.verify(token, 'anySecretKey', function (err, decoded) {
        if (err) {
            return res.status(403).json({
                message: 'Сессия с таким токеном отсутствует!'
            });
        } else {
            req.user = decoded;
            return next();
        }
    });
}

function checkToken(req, res) {
    let token = req.body.token || req.query.token || req.headers['x-auth'] || req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(403).json({errorMessage: 'Токен отсутствует!'});
    }
    // Get auth header value if it is bearer
    const bearerHeader = req.headers['authorization'];

    console.log(req.headers);
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      token = bearerToken;
    }

    // jwt.verify(token, process.env.SECRET, function (err, decoded) {
    jwt.verify(token, 'anySecretKey', function (err, decoded) {
        if (err) {
            return res.status(403).json({
                errorMessage: err
            });
        } else {
            return res.json({
                message: 'Token valid',
                decoded
            });
        }
    });
}


async function login(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        res.status(403).json({
            errorMessage: 'Имя пользователя или пароль отсутствуют'
        });
    }

    try {
      const user = await db.User.findOne({
        where: {
          username: req.body.username
        }
      })

      if (!user) {
          res.status(403).json({
              errorMessage: 'Пользователя с таким именем не существует'
          });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
            let token = jwt.sign({data: user}, 'anySecretKey', {expiresIn: 60 * 60 * 24 * 30});
            // let token = jwt.sign({data: user}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30});
            res.status(200).json({
                data: {token}
            });
        } else {
            res.status(403).json({
                message: 'Некорректный пароль'
            });
        }
      }
    } catch (error) {
      console.error(error);
      res.json({
        errorMessage: error.message
      })
    }
}


module.exports = {
  login: login,
  checkToken: checkToken,
  checkauth: checkauth

}
