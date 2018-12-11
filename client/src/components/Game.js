import React, { Component } from 'react';
import API from '../API';
import Board from './Board';
import Scoreboard from './Scoreboard';

class Game extends Component {
  state = {
    queued: false,
    player1: false,
    player2: false,
    moves: false,
    winner: false,
    playerCount: false
  };

  componentDidMount() {
    //NOTE; change this to getGame()
    API.getGame()
    .then(res => {
      const game = res.data;
      console.log(game)
      if (game) {
        API.joinGame(game._id, this.socketCallback)
      } else {
        API.getPlayerCount(playerCount => this.setState({ playerCount }))
      }
    })
    // .catch(err => alert('No game found'))
  }

  makeMove = move => {
    const { user } = this.props;
    const { player1, player2, moves } = this.state;

    if ((user.id == player1._id && moves.length % 2 === 0) ||
        (user.id == player2._id && moves.length % 2 !== 0)) {
      API.move(move)
    }
  };

  queue = () => {
    if (!this.state.queued) {
      API.queue(this.socketCallback)
      this.setState({ queued: true })
    } else {
      // they want to leave the queue so we'll refresh the window
      window.location.reload()
    }
  };

  socketCallback = (game, newMove, winner) => {
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
    const { player1, player2, moves, winner, queued, playerCount } = this.state;

    if (player1 && player2) {
      // game in progress
      return (
        <div>
          <Scoreboard player1={player1} player2={player2} moves={moves} winner={winner} />
  
          { moves && (
            <Board moves={moves} winner={winner} makeMove={this.makeMove} />
          )}
        </div>
      );  
    } else {
      // no game, user should queue up
      const style = {
        textAlign: 'center',
      };

      const buttonStyle = {
        marginTop: 48,
      };

      return (
        <div className="container pt-4" style={style}>
          <h1 className="display-4">Play Now</h1>
          {(playerCount || playerCount === 0) && (
            <p className="lead">
              {playerCount} players currently playing
            </p>
          )}
          <button
            className={"btn btn-lg btn-" + (queued ? 'secondary' : 'primary')}
            style={buttonStyle}
            onClick={this.queue}
          >
            { queued ? "Leave Queue" : "Enter Queue"}
          </button>
        </div>
      );
    }
  }
}

export default Game;
