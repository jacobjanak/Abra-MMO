import React, { Component } from 'react';
import MoveList from '../MoveList';
import Timer from '../Timer';
import './Scoreboard.css';

class Scoreboard extends Component {
    render() {
        const { player1, player2, moves, time, winner } = this.props;

        let activePlayer = moves.length % 2 ? 'player2' : 'player1';
        if (winner) activePlayer = false;

        return (
            <div id="scoreboard">
                <p className="lead">
                    <Timer unix={time.player1} active={activePlayer === 'player1'} />
                    <span className="username">{player1.username}</span>
                </p>
                <p className="lead">
                    <Timer unix={time.player2} active={activePlayer === 'player2'} />
                    <span className="username">{player2.username}</span>
                </p>
                
                <div id="move-controls">
                    <span className="move-control">
                        <i className="fas fa-fast-backward"></i>
                    </span>
                    <span className="move-control">
                        <i className="fas fa-caret-left" style={{ fontSize: '1.5em' }}></i>
                    </span>
                    <span className="move-control">
                        <i className="fas fa-caret-right" style={{ fontSize: '1.5em' }}></i>
                    </span>
                    <span className="move-control">
                        <i className="fas fa-fast-forward"></i>
                    </span>
                </div>

                <MoveList moves={moves} />
            </div>
        );
    }
}

export default Scoreboard;