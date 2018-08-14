import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import withAuth from './withAuth';

// pages
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';
import Game from './Game';
import JoinGame from './JoinGame';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile/:id" component={Profile} />
          <Route exact path="/play" component={withAuth(Game)} />
          <Route exact path="/join" component={withAuth(JoinGame)} />
        </div>
      </Router>
    );
  }
}

export default App;
