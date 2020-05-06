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
    API.getActiveGame()
    .then(res => {
      const game = res.data;
      if (game) {
        API.joinGame(game._id, this.socketCallback)
      } else {
        API.getPlayerCount(playerCount => {
          // prevent unnecessary re-renders if a game is in progress
          if (!this.state._id) {
            this.setState({ playerCount })
          }
        })
      }
    })
    // .catch(err => alert('No game found'))
  }

  reloadGame = () => {
    API.getGame(this.state._id)
    .then(res => {
      const game = res.data;
      if (game) {
        this.setState({
          moves: game.moves,
          winner: game.winner,          
          time: game.time
        })
      }
    })
  }

  makeMove = move => {
    const { user } = this.props;
    const { player1, player2, moves } = this.state;

    if ((user.id === player1._id && moves.length % 2 === 0) ||
        (user.id === player2._id && moves.length % 2 !== 0)) {
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
      this.setState(state => ({
        moves: [...state.moves, newMove.move],
        time: newMove.time
      }))
    }
    else if (winner) {
      this.setState({ winner })
    }
  };

  render() {
    const { player1, player2, moves, winner, time, queued, playerCount } = this.state;

    if (player1 && player2) {

      // game in progress
      return (
        <div>
          <Scoreboard 
            player1={player1} 
            player2={player2} 
            moves={moves} 
            time={time}
            winner={winner}
            reloadGame={this.reloadGame}
          />

          { moves && (
            <Board moves={moves} winner={winner} makeMove={this.makeMove} />
          )}
        </div>
      );  
        // <div>
        //   <Scoreboard 
        //     player1={player1} 
        //     player2={player2} 
        //     moves={moves} 
        //     time={time}
        //     winner={winner}
        //     reloadGame={this.reloadGame}
        //   />
        // </div>
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
            {queued ? "Leave Queue" : "Enter Queue"}
          </button>
        </div>
      );
    }
  }
}

export default Game;
