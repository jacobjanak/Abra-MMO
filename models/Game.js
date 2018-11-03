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
  moves: {
    type: [String],
    default: ['0,0', '0,1']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', GameSchema);
