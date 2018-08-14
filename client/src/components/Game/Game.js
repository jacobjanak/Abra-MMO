import React, { Component } from 'react';
import API from '../../API';

class Game extends Component {
  state = {
    player1: false,
    player2: false,
    moves: [],
  };

  componentWillMount() {
    API.getUser()
    .then(res => {
      const user = res.data;
      if (user.game) {
        API.joinGame(user.game, game => {
          this.setState({ ...game })
        })
      }
    })
    .catch(err => console.log('Error connecting to game'))
  }

  randomMove() {
    API.move('' + Math.random())
  }

  render() {
    return (
      <div>
        <p>{this.state.player1}</p>
        <p>{this.state.player2}</p>
        <h2>{this.props.user.id}</h2>
        { this.state.moves.map((move, i) => (
          <span key={i}>{move} </span>
        ))}
        <button onClick={this.randomMove}>
          Move
        </button>
      </div>
    );
  }
}

export default Game;
