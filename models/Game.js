const generateId = require('./generateId');
const abraLogic = require('../abra-logic/');

module.exports = db => {
  return {

    create: obj => {
      return new Promise((resolve, reject) => {
        const game = {};

        // store values
        game.player1 = obj.player1;
        game.player2 = obj.player2;
        game.time = obj.time;

        // default values
        const currentTime = Date.now();
        game.time.lastMove = currentTime;
        game.createdAt = currentTime;
        game._id = generateId();
        game.moves = ['0,0', '0,1'];
        game.winner = '';

        // save to db
        db.collection("games").doc(game._id).set(game)
        resolve(game)
      })
    },

    findOne: game => {
      return new Promise((resolve, reject) => {
        db.collection("games").get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const existingGame = doc.data();
            let match = true;
            for (const key in game) {

              // this replicates mongoDBs $or feature
              if (key === '$or') {
                const fields = game[key];
                for (let i = 0; i < fields.length; i++) {
                  for (const orKey in fields[i]) {
                    if (game[orKey] === fields[i][orKey]) {
                      resolve(existingGame)
                    }
                  }
                }

              } else {
                if (game[key] != existingGame[key]) {
                  match = false;
                }
              }
            }
            if (match === true) {
              resolve(existingGame);
            }
          })

          // no game found
          resolve(undefined)
        })
      })
      .catch(err => resolve());
    },

    findById: function(id) {
      return new Promise((resolve, reject) => {
        db.collection('games').doc('' + id).get()
        .then((doc) => {
          if (doc.exists) {
            const game = doc.data();

            abraLogic.findWinner(game.moves);

            resolve(game);
          } else {
            reject(null)
          }
        })
      })
    },

    save: game => {
      return new Promise((resolve, reject) => {
        db.collection("games").doc(game._id).set(game)
        resolve(game)
      })
    },

  };
};
