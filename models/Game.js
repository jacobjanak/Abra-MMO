const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  time: {
    lastMove: {
      type: Number,
      default: () => new Date().getTime()
    },
    player1: {
      type: Number,
    },
    player2: {
      type: Number,
    }
  },
  moves: {
    type: [String],
    default: ['0,0', '0,1']
  },
  winner: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// this listener will fire on .find() and .save() before any data changes
GameSchema.post('init', function (game) {
  if (!game.winner) {

    // check for time out
    const unix = new Date().getTime();
    const difference = unix - game.time.lastMove;
    
    // check if current player has timed out
    const activePlayer = game.moves.length % 2 ? 'player2' : 'player1';
    if (game.time[activePlayer] - difference <= 0) {
      game.time[activePlayer] = 0;
      game.winner = activePlayer === 'player1' ? 'player2' : 'player1';
      game.save()
    }
  }
})

module.exports = mongoose.model('Game', GameSchema);
