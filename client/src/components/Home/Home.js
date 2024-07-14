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

                <div id="play-button-container">
                    <Link to={"/play"} id="play-now" className="btn btn-dark btn-lg">
                        Play now
                        <img id="play-icon" src="../play.svg" alt="Play"/>
                    </Link>
                </div>

                <div id="privacy-policy-container">
                    <Link to={"/privacy-policy"} id="privacy-policy">
                        Privacy
                    </Link>
                </div>

                <div id="social-icon-container">
                    <a href="https://www.reddit.com/r/Diagazontal/" target="_blank">
                        <img
                            className="social-icon"
                            src="../reddit-logo.png"
                            alt="Reddit"
                        />
                    </a>

                    <a href="https://discord.gg/fXSS9Xe4" target="_blank">
                        <img
                            className="social-icon"
                            src="../discord-logo.png"
                            alt="Reddit"
                        />
                    </a>
                </div>
            </div>
        );
    }
}

export default Home;
