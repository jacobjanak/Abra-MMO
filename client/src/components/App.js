import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import withAuth from './withAuth';

// components
import NavBar from './NavBar';
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';
import Game from './Game';

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
          <Route exact path="/play" component={withAuth(Game)} />
        </div>
      </Router>
    );
  }
}

export default App;
