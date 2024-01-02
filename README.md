# Abra-MMO

[Click here to see the Android app version of this game.](https://github.com/jacobjanak/Abra-Android-App)

This is an online multiplayer game. You can play against anyone anywhere in the world. It is a board game, except there is no limit to the size of the board. It's most similar to games like Tic Tac Toe or Connect 4. The objective of Abra is to connect 5 squares in a row. The catch is that you can only put your piece next to an existing piece.

If you do not wish to play online, you can also play offline against a somewhat-challenging computer.

This project is built using a React.js front-end with Node.js and MongoDB on the backend. In other words, this project is built using the MERN stack. User authentication is secured with JSON web tokens and the app uses socket.js to allow gameplay between players in real-time.

UPDATE: MongoDB is no longer available for free on Heroku. So, I switched the database to use Firebase instead of MongoDB.

You will need to put a firebase-adminsdk.json file in the models/ directory. This contains the secrets to my database, so I cannot share it publicly.
