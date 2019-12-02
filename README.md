### Project with node.js, JWT, authentication, sequelize

 #### Useful links

  https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465

  https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize

 ### Hints

    to initialize sequelize
     $ sequelize init

    to generate models and mogrations
     $ sequelize model:create --name user --attributes username:string,email:string,password:text
    then update the js files if you need it


    create tables in db via migrations
       $ sequelize db:migrate

 ### to run the Project

    $ git clone https://github.com/ArmLil/my-auth-sequelize-jwt.git
    $ cd my-auth-sequelize-jwt.git
    $ npm install
    $ npm start
