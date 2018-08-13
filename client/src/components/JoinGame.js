import React, { Component } from 'react';
import API from '../API';

class JoinGame extends Component {
  state = {
    queued: false,
  };

  handleClick = () => {
    if (!this.state.queued) {
      API.join(this.props.user.id)
      .then(res => {
        const { game, queued } = res.data;
        if (queued) {
          this.setState({ queued: true })
        } else {
          alert('send you to your game')
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
