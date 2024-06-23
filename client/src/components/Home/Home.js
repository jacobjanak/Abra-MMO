import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Home.css';

class Home extends Component {
    render() {
        const style = {
            paddingTop: 24,
            textAlign: 'center',
        };

        return (
            <div style={style}>
                <h1 id="logo-subtext" className="display-6">Diagazontal, a Strategy Game</h1>

                <Link to={"/play"} id="play-now" className="btn btn-dark btn-lg">
                    Play now
                    <img id="play-icon" src="../play.svg" alt="Play" />
                </Link>
            </div>
        );
    }
}

export default Home;
