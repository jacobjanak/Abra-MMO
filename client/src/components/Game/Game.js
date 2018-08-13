import React, { Component } from 'react';
import API from '../../API';

class Game extends Component {
  state = {
    game: false
  };

  componentWillMount() {
    API.getGame(this.props.user.id)
    .then(res => this.setState({ game: res.data }))
    .catch(err => console.log(err))
  }

  render() {
    console.log(this.props.user)
    return (
      <div>
        <p>{this.state.game.player1}</p>
        <p>{this.state.game.player2}</p>
        <h2>{this.props.user.id}</h2>
      </div>
    );
  }
}

export default Game;
