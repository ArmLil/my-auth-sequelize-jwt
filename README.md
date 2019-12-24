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
    2.$ sequelize db:migrate

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



    2. Chatrooms (include headers described in the beginning)

    	1) method - get
          endpoint - /chats
          returns the list of chats
          expected response
          {
              "chatrooms": {
                  "count": 3,
                  "rows": [
                      {
                          "id": "bec51cbe-3bfa-4c49-8579-686bb651f653",
                          "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                          "name": "classroom 10",
                          "chat_type": "group",
                          "createdAt": "2019-12-20T07:04:47.820Z",
                          "updatedAt": "2019-12-20T07:04:47.820Z",
                          "deletedAt": null
                      },
                      {
                          "id": "1252f353-fd81-47ce-afe2-f1ec44167240",
                          "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                          "name": "classroom 11",
                          "chat_type": "group",
                          "createdAt": "2019-12-20T07:12:39.163Z",
                          "updatedAt": "2019-12-20T07:12:39.163Z",
                          "deletedAt": null
                      },
                      {
                          "id": "aa06ccee-fd56-4f39-ab0b-9237e8bd42c7",
                          "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                          "name": "username3_username4",
                          "chat_type": "pairs",
                          "createdAt": "2019-12-20T07:26:41.550Z",
                          "updatedAt": "2019-12-20T07:26:41.550Z",
                          "deletedAt": null
                      }
                  ]
              }
          }


      2) method - get
         endpoint -/chatroomById/:id
         returns a single chat by it's id

         expected response

         {
             "chatroom": {
                 "id": "1252f353-fd81-47ce-afe2-f1ec44167240",
                 "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                 "name": "classroom 11",
                 "chat_type": "group",
                 "createdAt": "2019-12-20T07:12:39.163Z",
                 "updatedAt": "2019-12-20T07:12:39.163Z",
                 "deletedAt": null
             }
         }

      3) method-post
         endpoint - /chats
          this creates a new chat

          1. example request body
             if type is 'group' then name is required

             {
               name: 'classroom 1',
               chat_type: 'group'
             }

            expected response body

            {
              "chat": [
                  {
                      "id": "2001e960-0cc8-4c86-9a30-c4c88550055c",
                      "name": "classroom 5",
                      "chat_type": "group",
                      "updatedAt": "2019-12-19T10:37:15.469Z",
                      "createdAt": "2019-12-19T10:37:15.469Z",
                      "deletedAt": null,
                      "creator": {
                          "id": "9d6f27ac-3367-4496-bd57-c54a986e68e4",
                          "username": "username3",
                          "email": "armlilhov@mail.ru",
                          "email_confirmed": true
                      }
                  },
                  true
              ]
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
                "chatroom": [
                    {
                        "id": "aa06ccee-fd56-4f39-ab0b-9237e8bd42c7",
                        "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                        "name": "username3_username4",
                        "chat_type": "pairs",
                        "createdAt": "2019-12-20T07:26:41.550Z",
                        "updatedAt": "2019-12-20T07:26:41.550Z",
                        "deletedAt": null,
                        "receiver": {
                            "id": "1d6f27ac-3367-4496-bd57-c54a986e68e3",
                            "username": "username4",
                            "email": "testmail@mail.ru",
                            "email_confirmed": true,
                            "createdAt": "2019-12-20T07:12:39.163Z",
                            "updatedAt": "2019-12-20T07:12:39.163Z",
                            "deletedAt": null
                        },
                        "creator": {
                            "id": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                            "username": "username3",
                            "email": "armlilhov@mail.ru",
                            "email_confirmed": null
                        }
                    },
                    false
                ]
            }

      4)  method - put
          endpoint - /chatrooms/:id
          this updates a  chat with a name

           id - is a chatroom id
           chatroom type should be group

           example request body

           {
                     "name": "classroom 50",
                     "chat_type": "group"
                 }

          	 expected response body

          	 {
              "chatroom": {
                  "id": "3edfbc7c-c939-4e9d-8bb3-a20eaaebaacb",
                  "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                  "name": "classroom 50",
                  "chat_type": "group",
                  "createdAt": "2019-12-20T13:48:29.975Z",
                  "updatedAt": "2019-12-23T07:47:33.017Z",
                  "deletedAt": null
              }
          }

      5) method - delete
         endpoint - /chatrooms/:id

          this deletes a  chatroom
          id - is a chatroom id
          chatroom type should be group or pairs

          expected response body

          {
            "massage": "chatroom classroom 50, 3edfbc7c-c939-4e9d-8bb3-a20eaaebaacb is deleted"
          }

      6) method - post
         endpoint - /memberToGroup

         this adds a new member to  chatroom
         chatroom type should be group

         example request body

         {

           "memberId": "22f621b5-555c-490f-83ff-e54dde87f191",
           "chatroomId": "6b03f30f-6028-49be-ab2d-1aed013395e8"
         }

      	expected response body

      	[
          {
              "id": "8506acea-5076-41d1-8af4-177a753da155",
              "memberId": "22f621b5-555c-490f-83ff-e54dde87f191",
              "chatroomId": "6b03f30f-6028-49be-ab2d-1aed013395e8",
              "memberName": "user10",
              "chatroomName": "classroom 2",
              "updatedAt": "2019-12-23T13:18:04.063Z",
              "createdAt": "2019-12-23T13:18:04.063Z",
              "deletedAt": null
          },
          true
        ]

        7) method - delete
           endpoint - /memberInGroup

           this deletes a member from the  chatroom
           chatroom type should be group

           example request body

            {
            	"memberId": "22f621b5-555c-490f-83ff-e54dde87f191",
            	"chatroomId": "6b03f30f-6028-49be-ab2d-1aed013395e8"
            }

        	expected response body

          	{
              "id": "8506acea-5076-41d1-8af4-177a753da155",
              "memberId": "22f621b5-555c-490f-83ff-e54dde87f191",
              "chatroomId": "6b03f30f-6028-49be-ab2d-1aed013395e8",
              "memberName": "user10",
              "chatroomName": "classroom 2",
              "createdAt": "2019-12-23T13:18:04.063Z",
              "updatedAt": "2019-12-23T13:44:24.957Z",
              "deletedAt": "2019-12-23T13:44:24.955Z"
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


  3. chatMessages (include headers described in the beginning)

    	1)  method - get
         endpoint - /chatMessages
         returns the list of all chatMessages

         expected response example

         {
        "chatMessages": {
            "count": 4,
            "rows": [
                {
                    "id": "3c997377-9d60-411f-a3a8-875aac92e3a6",
                    "message": "Hi there!!!!",
                    "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "chatroomId": "6b03f30f-6028-49be-ab2d-1aed013395e8",
                    "createdAt": "2019-12-24T08:03:59.533Z",
                    "updatedAt": "2019-12-24T08:03:59.533Z",
                    "deletedAt": null
                },
                {
                    "id": "c18d753d-8d0a-459a-aa0f-5df88742c2b0",
                    "message": "Hello!!!!",
                    "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "chatroomId": "6b03f30f-6028-49be-ab2d-1aed013395e8",
                    "createdAt": "2019-12-24T08:05:00.639Z",
                    "updatedAt": "2019-12-24T08:05:00.639Z",
                    "deletedAt": null
                },
                {
                    "id": "5fdc6a4d-4727-4d8b-9e53-58c9f90203e4",
                    "message": "Wow!!!!",
                    "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "chatroomId": "0c9d3fb1-652c-4dc5-a49f-5d7f991f3bda",
                    "createdAt": "2019-12-24T08:35:01.391Z",
                    "updatedAt": "2019-12-24T08:35:01.391Z",
                    "deletedAt": null
                },
                {
                    "id": "6b7af9d8-4696-473f-91dc-ba845604b2ed",
                    "message": "What's up!!!!",
                    "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "chatroomId": "0c9d3fb1-652c-4dc5-a49f-5d7f991f3bda",
                    "createdAt": "2019-12-24T08:35:12.420Z",
                    "updatedAt": "2019-12-24T08:35:12.420Z",
                    "deletedAt": null
                }
              ]
        	}
        }

      2)  method - get
          endpoint - /chatMessages/:chatroomId
           returns the list of chatMessages by chatroomId

        	 expected response example

        	{
            "chatMessages": {
                "count": 2,
                "rows": [
                    {
                        "id": "5fdc6a4d-4727-4d8b-9e53-58c9f90203e4",
                        "message": "Wow!!!!",
                        "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                        "chatroomId": "0c9d3fb1-652c-4dc5-a49f-5d7f991f3bda",
                        "createdAt": "2019-12-24T08:35:01.391Z",
                        "updatedAt": "2019-12-24T08:35:01.391Z",
                        "deletedAt": null
                    },
                    {
                        "id": "6b7af9d8-4696-473f-91dc-ba845604b2ed",
                        "message": "What's up!!!!",
                        "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                        "chatroomId": "0c9d3fb1-652c-4dc5-a49f-5d7f991f3bda",
                        "createdAt": "2019-12-24T08:35:12.420Z",
                        "updatedAt": "2019-12-24T08:35:12.420Z",
                        "deletedAt": null
                    }
                  ]
                }
            }

       3)  method - get
           endpoint - /chatMessageById/:id
           returns the list of chatMessage by it’s id

        	 expected response example

        	 {
            "chatMessage": {
                "id": "5fdc6a4d-4727-4d8b-9e53-58c9f90203e4",
                "message": "Wow!!!!",
                "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                "chatroomId": "0c9d3fb1-652c-4dc5-a49f-5d7f991f3bda",
                "createdAt": "2019-12-24T08:35:01.391Z",
                "updatedAt": "2019-12-24T08:35:01.391Z",
                "deletedAt": null,
                "creator": {
                    "id": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "username": "username3",
                    "email": "armlilhov@mail.ru",
                    "email_confirmed": true,
                    "createdAt": "2019-12-19T14:18:09.015Z",
                    "updatedAt": "2019-12-19T14:22:39.037Z"
                },
                "chatroom": {
                    "id": "0c9d3fb1-652c-4dc5-a49f-5d7f991f3bda",
                    "creatorId": "0b776e22-b605-4df0-9fce-82eb0cee5c8a",
                    "name": "common",
                    "chat_type": "general",
                    "createdAt": "2019-12-19T14:18:09.015Z",
                    "updatedAt": "2019-12-19T14:18:09.015Z",
                    "deletedAt": null
                }
             }
          }


       4)  method - post
           endpoint - /chatMessages
           this creates a new chatMessage

    	      example request body

        	 {
             "message": "Test !!!!",
             "chatroomId": "9c9d3fb1-652c-4dc5-a49f-5d7f991f3bdb"
           }

            example response body

            {
                "chatMessage": [
                    {
                        "id": "81c902ae-41de-405f-85c3-0efc335ac0cc",
                        "message": "Test !!!!",
                        "chatroomId": "9c9d3fb1-652c-4dc5-a49f-5d7f991f3bdb",
                        "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                        "updatedAt": "2019-12-24T10:39:11.761Z",
                        "createdAt": "2019-12-24T10:39:11.761Z",
                        "deletedAt": null
                    },
                    true
                ]
            }



        5)  method - put
            endpoint - /chatMessages/:id
            this updattes a new chatMessage

          	example request body

          	{
                 "message": "Test update!!!!",
                 "chatroomId": "9c9d3fb1-652c-4dc5-a49f-5d7f991f3bdb"
            }

            example response body

            {
                "chatMessage": {
                    "id": "81c902ae-41de-405f-85c3-0efc335ac0cc",
                    "message": "Test update!!!!",
                    "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "chatroomId": "9c9d3fb1-652c-4dc5-a49f-5d7f991f3bdb",
                    "createdAt": "2019-12-24T10:39:11.761Z",
                    "updatedAt": "2019-12-24T10:43:48.854Z",
                    "deletedAt": null
                }
            }

        6)  method - delete
            endpoint - /chatMessages/:id
            this deletes a chatMessage

            example response body

            {
                "chatMessage": {
                    "id": "81c902ae-41de-405f-85c3-0efc335ac0cc",
                    "message": "Test update!!!!",
                    "creatorId": "6b776e22-b605-4df0-9fce-82eb0cee5c8e",
                    "chatroomId": "9c9d3fb1-652c-4dc5-a49f-5d7f991f3bdb",
                    "createdAt": "2019-12-24T10:39:11.761Z",
                    "updatedAt": "2019-12-24T10:47:41.834Z",
                    "deletedAt": "2019-12-24T10:47:41.832Z"
                },
                "massage": "chatMessage \"Test update!!!!\", 81c902ae-41de-405f-85c3-0efc335ac0cc is deleted"
            }
