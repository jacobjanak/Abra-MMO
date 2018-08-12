import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

// pages
import Home from './Home';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile/:id" component={Profile} />
        </div>
      </Router>
    );
  }
}

export default App;
