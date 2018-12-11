import React, { Component } from 'react';
import MoveList from './MoveList';
import './Scoreboard.css';

class Scoreboard extends Component {
    render() {
        const { player1, player2, moves, winner }= this.props;

        return (
            <div id="scoreboard">
                <p className="lead">
                    {player1.username}
                    <span className="timer">3:43</span>
                </p>
                <p className="lead">
                    {player2.username}
                    <span className="timer">5:07</span>
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

                <MoveList
                    moves={moves}
                    onScrolled={e => {/* just need this function to exist */}}
                    onScrolledTop={e => {/* just need this function to exist */}}
                />

                {/* <p style={{ color: 'red' }}>
                    Player 1: {player1.username}&nbsp;
                    {moves.length % 2 === 0 && !winner && (
                        <span>(active)</span>
                    )}
                    {winner === 'player1' && (
                        <span>(winner)</span>
                    )}
                </p>
                <p style={{ color: 'blue' }}>
                    Player 2: {player2.username}&nbsp;
                    {moves.length % 2 !== 0 && !winner && (
                        <span>(active)</span>
                    )}
                    {winner === 'player2' && (
                        <span>(winner)</span>
                    )}
                </p> */}
            </div>
        );
    }
}

export default Scoreboard;