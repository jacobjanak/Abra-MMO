import React, { Component } from 'react';

class Game extends Component {
  render() {
    console.log(this.props.user)
    return (
      <h2>{this.props.user.id}</h2>
    );
  }
}

export default Game;
