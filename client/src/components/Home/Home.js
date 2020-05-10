import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../AuthService';
import Logo from '../Logo';
import './Home.css';

const Auth = new AuthService();

class Home extends Component {
  render() {
    const style = {
      paddingTop: 24,
      textAlign: 'center',
    };

    return (
      <div style={style}>
        <Logo />

        <h1 id="logo-subtext" className="display-6">Abra, the Strategy Game</h1>

        {/* <p className="lead">Welcome to the best game you've ever played.</p> */}

        <Link to={"/play"}>
          <a id="play-now" className="btn btn-dark btn-lg" href="/play">
            Play now <i className="fas fa-play" style={{ marginLeft: 4 }}></i>
          </a>
        </Link>
      </div>
    );
  }
}

export default Home;
