import React, { Component } from 'react';
import API from '../../API';
import Board from './components/Board';

class Game extends Component {
  state = {
    queued: false,
    player1: false,
    player2: false,
    moves: false,
    winner: false,
  };

  componentDidMount() {
    //NOTE; change this to getGame()
    API.getGame()
    .then(res => {
      const game = res.data;
      console.log(game)
      if (game) {
        API.joinGame(game._id, this.socketCallback)
      }
    })
    .catch(err => alert('Error connecting to game'))
  }

  makeMove = move => {
    const { user } = this.props;
    const { player1, player2, moves } = this.state;

    console.log('calling makeMove')
    console.log(player1)
    console.log(player2)
    console.log(user.id)
    if ((user.id == player1._id && moves.length % 2 === 0) ||
        (user.id == player2._id && moves.length % 2 !== 0)) {
      console.log('calling api.move')
      API.move(move)
    }
  };

  queue = () => {
    if (!this.state.queued) {
      console.log('queued now')
      API.queue(this.socketCallback)
    }
  };

  socketCallback = (game, newMove, winner) => {
    console.log('using the socketCallbakc')
    if (game) this.setState({ ...game });
    else if (newMove) {
      this.setState(state => {
        state.moves.push(newMove)
        //NOTE: why did I write this code:
        // state.newMove = newMove;
        return state;
      })
    }
    else if (winner) {
      this.setState({ winner })
    }
  };

  render() {
    const { player1, player2, moves, winner } = this.state;

    if (player1 && player2) {
      // game in progress
      return (
        <div>
          <div>
            <p style={{ color: 'red' }}>
              Player 1: {this.state.player1.username}&nbsp;
              { moves.length % 2 === 0 && !winner && (
                <span>(active)</span>
              )}
              { winner === 'player1' && (
                <span>(winner)</span>
              )}
            </p>
            <p style={{ color: 'blue' }}>
              Player 2: {this.state.player2.username}&nbsp;
              { moves.length % 2 !== 0 && !winner && (
                <span>(active)</span>
              )}
              { winner === 'player2' && (
                <span>(winner)</span>
              )}
            </p>
          </div>
  
          { moves && (
            <Board moves={moves} winner={winner} makeMove={this.makeMove} />
          )}
        </div>
      );  
    } else {
      // no game, user should queue up
      return (
        <div>
          <button onClick={this.queue}>Queue</button>
        </div>
      );
    }
  }
}

export default Game;
