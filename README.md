### Project with node.js, JWT, authentication, sequelize

#### Useful links

https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465

https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize

https://learning.getpostman.com/docs/postman/sending-api-requests/authorization/#bearer-token

https://medium.com/@tonyangelo9707/many-to-many-associations-using-sequelize-941f0b6ac102

### Hints

    to initialize sequelize
     $ sequelize init

    to generate models and migrations
     $ sequelize model:create --name User --attributes username:string,email:string,password:text
    then update the js files if you need it

    another example
    $ sequelize model:create --name UsersChats --attributes id:uuid,user_id:uuid,chat_id:uuid


    create tables in db via migrations
       $ sequelize db:migrate

#### setup datasource

    1.install postgres if do not have then follow the steps bellow
      $ sudo -u postgres psql
      postgres=# create database auth_jwt_sequelize;
      postgres=# create user auth_jwt_sequelize_user with encrypted password '111111';
      postgres=# grant all privileges on database auth_jwt_sequelize to auth_jwt_sequelize_user;

### to run the Project

    $ git clone https://github.com/ArmLil/my-auth-sequelize-jwt.git
    $ cd my-auth-sequelize-jwt.git
    $ npm install
    $ npm start

### API - description

    All the endpoints start with /api/v1, for example /register is implemented as /api/v1/register.
    Locally listening on http://localhost:3000
    Example endpoint
    http://localhost:3000/api/v1/register

    All the requests have headers with  “Content-Type: application/json”

    After registration for all other requests token is required in headers

    Registration implemented according to JWT https://jwt.io/

    In headers we need to add
    Authorization : Bearer token


    1. Registration

       1) method - post
          endpoint - /register

          request body example (email and username are unique )
           {
            	"password": "111111",
          	  "email": "armlilhov@mail.ru",
          	  "username": "username3"
           }


          expected response body example
          {
              "data": {
                  "user": [
                      {
                          "id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                          "email": "armlilhov@mail.ru",
                          "username": "username3",
                          "updatedAt": "2019-12-18T13:13:27.608Z",
                          "createdAt": "2019-12-18T13:13:27.608Z",
                          "email_confirmed": false,
                          "deletedAt": null
                      },
                      true
                  ],
                  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOWQ2ZjI3YWMtMzM2Ny00NDk2LWJkNTctYzU0YTk4NmU2OGU0IiwidXNlcm5hbWUiOiJ1c2VybmFtZTMiLCJlbWFpbCI6ImFybWxpbGhvdkBtYWlsLnJ1IiwiZW1haWxfY29uZmlybWVkIjpmYWxzZX0sImlhdCI6MTU3NjY3NDgwOCwiZXhwIjoxNTc2NzYxMjA4fQ.BoCFPlppYEv5HREEbbzKD9X1DrM46yIzBV9IbJroP9A",
                  "message": "Check armlilhov@mail.ru for confirmation "
              }
          }

          then the mentioned email should be checked for email confirmation or use the request described in the 2) point



          2) method - get
             endpoint - /confirmation/:token
            (token can be taken from the response of   /register request described in 2) point)

          3) method - post
             endpoint - /login

             request body example

              {
                "email": "armlilhov@mail.ru",
                "password": "111111"
              }

            expected response body example
            {
                "data": {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOWQ2ZjI3YWMtMzM2Ny00NDk2LWJkNTctYzU0YTk4NmU2OGU0IiwidXNlcm5hbWUiOiJ1c2VybmFtZTMiLCJlbWFpbCI6ImFybWxpbGhvdkBtYWlsLnJ1IiwiZW1haWxfY29uZmlybWVkIjp0cnVlfSwiaWF0IjoxNTc2Njc5MTU4LCJleHAiOjE1NzY3NjU1NTh9.OsfcCWB3EMSoIwMssAaznw0-5TL01UiiKyshjOctGIY"
                }
            }



    2. Chats (include headers described in the beginning)

    	1)  method - get
          endpoint - /chats
          returns the list of chats
          expected response
          {
            [
               {
                 id: '65465465465696',
                 name: 'classroom 123',
                 chat_type: 'group',
                 createdAt: '2019-10-04 11:48:29.723+03',
                 creator: {
                   user_id: 656546464,
                   username: 'name1',
                   email: 'any1@mail.ru',
                   email_confirmed: true,
                   createdAt: '2019-10-02 11:48:29.723+03'
                 }
               },
               {
                 id: '35465465465696',
                 name: 'general',
                 chat_type: 'general',
                 createdAt: '2019-10-04 11:48:29.723+03',
                 creator: {
                   user_id: 856546464,
                   username: 'name2',
                   email: 'any2@mail.ru',
                   email_confirmed: true,
                   createdAt: '2019-10-03 11:48:29.723+03'
                 }
               },
               ......
             ]
           }

     2) method-get
        endpoint-a/getChatById/:id
        returns a single chat by it's id

        expected response

         {
           id: '65465465465696',
           name: 'classroom 123',
           chat_type: 'group',
           createdAt: '2019-10-04 11:48:29.723+03',
           creator: {
             user_id: 656546464,
             username: 'name1',
             email: 'any1@mail.ru',
             email_confirmed: true,
             createdAt: '2019-10-02 11:48:29.723+03'
           },
           members: [
             {
               user_id: 656546464,
               username: 'any name',
               email: 'any@mail.ru',
               email_confirmed: true,
               createdAt: '2019-10-02 11:48:29.723+03'
             },
             {
               user_id: 656546464,
               username: 'any name 1',
               email: 'any1@mail.ru',
               email_confirmed: true,
               createdAt: '2019-10-03 11:48:29.723+03'
             },
             ......
           ],
           chat_messages: [
             {
               id: '6546546897',
               writer: {
                 user_id: 656546464,
                 username: 'any name',
                 email: 'any@mail.ru',
                 email_confirmed: true,
                 createdAt: '2019-10-02 11:48:29.723+03'
               },
               massage: 'any message',
               chat_id: '989765564646',
               createdAt: '2019-10-02 11:48:29.723+03'
             },
             .........
           ]
         }


     3) 	method-post
          endpoint - /chats
          this creates a new chat

          1. example request body
             if type is 'group' then name is required

             {
               name: 'classroom 1',
               chat_type: 'group',
             }

            expected response body

             {
               id: '65465465465696'
               name: 'classroom 1',
               chat_type: 'group',
               createdAt: '2019-10-04 11:48:29.723+03'
               creator: {
                   user_id: 656546464,
                   username: 'any name',
                   email: 'any@mail.ru',
                   email_confirmed: true,
                   createdAt: '2019-10-02 11:48:29.723+03'
                 }
             }

          2. example request body
             if type is 'pairs' receiver_id is required

             {
               chat_type: 'pairs',
               receiver_id: '65654646470'
             }

             expected response body
             {
               id: '8546546546569'
               name: 'user1_user2',
               chat_type: 'pairs',
               createdAt: '2019-10-04 11:48:29.723+03'
               creator: {
                   user_id: 656546464,
                   username: 'user1',
                   email: 'any@mail.ru',
                   email_confirmed: true,
                   createdAt: '2019-10-02 11:48:29.723+03'
                 },
               receiver: {
                   user_id: 656546464,
                   username: 'user2',
                   email: 'any2@mail.ru',
                   email_confirmed: true,
                   createdAt: '2019-10-03 11:48:29.723+03'
                 }
             }

    3. Users (include headers described in the beginning)

     	1)  method - get
           endpoint - /users
           returns the list of users

           expected response
           {
               "users": [
                   {
                       "id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                       "username": "username3",
                       "email": "armlilhov@mail.ru",
                       "email_confirmed": true,
                       "createdAt": "2019-12-18T13:13:27.608Z",
                       "updatedAt": "2019-12-18T14:20:43.240Z",
                       "deletedAt": null
                   },
                   ......
               ]
           }

       2) method-get
          endpoint - /userById/:id
          returns a single user by it's id

          expected response

          {
            "user": {
                "id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                "username": "username3",
                "email": "armlilhov@mail.ru",
                "email_confirmed": true,
                "createdAt": "2019-12-18T13:13:27.608Z",
                "updatedAt": "2019-12-18T14:20:43.240Z",
                "deletedAt": null,
                "articles": [
                    {
                        "id": "c3dfc42b-83a0-4829-81ae-4c4e12362ed2",
                        "title": "test title 1",
                        "content": "test content",
                        "author": "Default author",
                        "user_id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                        "createdAt": "2019-12-19T08:19:15.999Z",
                        "updatedAt": "2019-12-19T08:19:15.999Z",
                        "deletedAt": null
                    },
                    {
                        "id": "cea17953-810c-4ada-903c-7ccd965bf3f0",
                        "title": "test title 33",
                        "content": "test content",
                        "author": "Default author",
                        "user_id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                        "createdAt": "2019-12-19T08:20:58.991Z",
                        "updatedAt": "2019-12-19T08:20:58.991Z",
                        "deletedAt": null
                    }
                ]
            }
        }
