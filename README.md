### Project with node.js, JWT, authentication, sequelize

 #### Useful links

  https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465

  https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize


      1. $ mkdir my-auth-sequelize
      2. $ cd my-auth-sequelize
      3. $ npm init
      4. $ npm install sequelize-cli -g
      5. $ npm install sequelize --save
      6. $ sequelize init
      7. $ sequelize model:create --name User --attributes username:string,email:string,password:text
      then update the js files if you need it
      8. $ sequelize db:migrate
      ERROR: Please install pg package manually
      9. $ npm install express --save
      10. $ npm install --save pg pg-hstore
      11. $ npm install body-parser --save
      12. $ npm install morgan
      13. $ npm install jsonwebtoken
      13. $ npm install bcrypt
