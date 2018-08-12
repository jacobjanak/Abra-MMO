import React, { Component } from 'react';
import API from '../../API';

class Chat extends Component {
  constructor(props) {
    super()

    this.state = {
      timestamp: 'no timestamp yet'
    };

    API.subscribeToTimer(props.user, (err, timestamp) => {
      console.log('HELLLLOOO')
      console.log(err)
      this.setState({ timestamp })
    })
  }

  render() {
    return (
      <div>
        This is the timer value: {this.state.timestamp}
        <ul id="messages"></ul>
        <form action="">
          <input id="m" autoComplete="off" />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default Chat;
