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

module.exports = mongoose.model('Game', GameSchema);
