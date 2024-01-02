const generateId = require('./generateId');
const abraLogic = require('../abra-logic/');

module.exports = db => {
    return {
        create: data => {
            return new Promise((resolve, reject) => {
                const currentTime = Date.now();

                const game = {
                    _id: generateId(),
                    player1: data.player1,
                    player2: data.player2,
                    moves: ['0,0', '0,1'],
                    winner: null,
                    createdAt: currentTime,
                    time: {
                        player1: data.time.player1,
                        player2: data.time.player2,
                        lastMove: currentTime,
                    },
                };

                db.collection('games').doc(game._id).set(game)
                resolve(game)
            })
        },

        findById: function (id) {
            return new Promise((resolve, reject) => {
                db.collection('games').doc(id).get()
                    .then((doc) => {
                        if (!doc.exists) {
                            reject()
                            return;
                        }

                        // check for a winner to ensure up-to-date data
                        const game = doc.data();
                        if (!game.winner && abraLogic.findWinner(game))
                            this.save(game);

                        resolve(game);
                    })
            })
        },

        save: game => {
            db.collection('games').doc(game._id).set(game)
        },
    };
};
