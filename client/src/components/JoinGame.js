import React, { Component } from 'react';
import API from '../API';

class JoinGame extends Component {
  state = {
    queued: false,
  };

  handleClick = () => {
    if (!this.state.queued) {
      API.queue()
      .then(res => {
        const { game, queued } = res.data;
        if (queued) {
          this.setState({ queued: true })
        }
        else if (game) {
          this.props.history.push('/play')
        }
      })
      .catch(err => console.log(err))
    }
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        { this.state.queued ? 'Waiting for Opponent' : 'Join Game' }
      </button>
    );
  }
}

export default JoinGame;
