import React, { Component } from 'react';
import AuthService from '../AuthService';
import Logo from '../Logo';
import './Home.css';

const Auth = new AuthService();

class Home extends Component {
  render() {
    return (
      <div className="App">
        <div className="jumbotron">
          <Logo />

          <h1 className="display-4">The Strategy Game</h1>
          {/* <p className="lead">Welcome to the best game you've ever played.</p> */}
          <a id="play-now" className="btn btn-dark btn-lg" href="/play">
            Play Now <i className="fas fa-play" style={{ marginLeft: 4 }}></i>
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
