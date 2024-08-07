import React, {Component} from 'react';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';

// components
import NavBar from './NavBar/';
import Home from './Home/';
import Login from './Login/';
import Profile from './Profile';
import Signup from './Signup/';
import GameOnline from './GameOnline';
import GameComputer from './GameComputer';
import Rankings from './Rankings';
import Privacy from './Privacy';
import DeleteAccount from './DeleteAccount';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <NavBar/>
                    <Routes>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route exact path="/signup" element={<Signup/>}/>
                        <Route exact path="/profile/:username" element={<Profile/>}/>
                        <Route exact path="/play" element={<GameComputer/>}/>
                        <Route exact path="/online" element={<GameOnline/>}/>
                        <Route exact path="/users" element={<Rankings/>}/>
                        <Route exact path="/privacy-policy" element={<Privacy/>}/>
                        <Route exact path="/delete-account" element={<DeleteAccount/>}/>
                        <Route path="/*" element={<Home/>}/>
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
