import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import withAuth from './withAuth';

// components
import NavBar from './NavBar/';
import Home from './Home/';
import Login from './Login/';
import Profile from './Profile';
import Signup from './Signup/';
import GameOnline from './GameOnline';
import GameComputer from './GameComputer';
import Music from './Music';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile/:username" component={Profile} />
          <Route exact path="/play" component={GameComputer} />
          <Route exact path="/online" component={withAuth(GameOnline)} />
          <Music />
        </div>
      </Router>
    );
  }
}

export default App;
