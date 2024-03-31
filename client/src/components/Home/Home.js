import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../AuthService';
import Logo from '../Logo';
import './Home.css';

class Home extends Component {
    render() {
        const style = {
            paddingTop: 24,
            textAlign: 'center',
        };

        // <Logo/>

        return (
            <div style={style}>
                <h1 id="logo-subtext" className="display-6">Abra, the Strategy Game</h1>

                <Link to={"/play"} id="play-now" className="btn btn-dark btn-lg">
                    Play now <i className="fas fa-play" style={{marginLeft: 4}}></i>
                </Link>
            </div>
        );
    }
}

export default Home;
