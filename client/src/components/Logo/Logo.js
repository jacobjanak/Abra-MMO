import React, { Component } from 'react';
import Tile from '../Tile';
import './Logo.css';

class Logo extends Component {
    render() {
        return (
            <div className="logo-container">
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <br />
                <Tile owner="player1" />
                <Tile />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile />
                <Tile owner="player2" />
                <Tile owner="player1" />
                <Tile />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile />
                <Tile owner="player2" />
                <br />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <br />
                <Tile owner="player1" />
                <Tile />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile />
                <Tile owner="player2" />
                <Tile owner="player1" />
                <Tile />
                <Tile owner="player1" offCenter />
                <Tile owner="player2" />
                <Tile />
                <Tile owner="player2" />
                <br />
                <Tile owner="player1" />
                <Tile />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player2" />
                <Tile owner="player1" />
                <Tile />
                <Tile owner="player1" />
                <Tile owner="player2" />
                <Tile />
                <Tile owner="player2" />
            </div>
        );
    }
}

export default Logo;