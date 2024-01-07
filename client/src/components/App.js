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
import Music from './Music';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <NavBar/>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route exact path="/signup" element={<Signup/>}/>
                        <Route exact path="/profile/:username" element={<Profile/>}/>
                        <Route exact path="/play" element={<GameComputer/>}/>
                        <Route exact path="/online" element={<GameOnline/>}/>
                        {/* <Music /> */}
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
