require('dotenv').config()

module.exports = {
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": 5432,
    "dialect": "postgres",
    "operatorsAliases": false
  },
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": 5432,
    "dialect": "postgres",
    "operatorsAliases": false,
    "email": {
      "host": "smtp.yandex.ru",
      "port": 465,
      "auth": {
        "user": "stepler.vtk@yandex.ru",
        "pass": "stepler2019"
      },
      "secure": "true",
      "from": "stepler.vtk@yandex.ru",
      "to": "lilia.og@yandex.ru"
    }
  }
}
