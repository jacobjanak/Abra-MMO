import React, { Component } from 'react';
import MoveList from '../MoveList';
import Timer from '../Timer';
import './Scoreboard.css';

class Scoreboard extends Component {
    render() {
        const { player1, player2, moves, time, winner, reloadGame } = this.props;

        let activePlayer = moves.length % 2 ? 'player2' : 'player1';
        if (winner) activePlayer = false;

        return (
            <div id="scoreboard">   
                <h2>
                    <span
                        className="px-2 py-1 mr-2"
                        id={activePlayer === 'player1' ? 'active-timer' : ''}
                    >
                        <Timer 
                            unix={time.player1} 
                            active={activePlayer === 'player1'} 
                            reloadGame={reloadGame}
                        />
                    </span>
                    <span className="px-2 py-1 mr-2">{player1.username}</span>
                    <span className="py-1 ml-1 mr-1">vs</span>
                    <span className="px-2 py-1 ml-2">{player2.username}</span>
                    <span
                        id={activePlayer === 'player2' ? 'active-timer' : ''}
                        className="px-2 py-1 ml-2"
                    >
                        <Timer 
                            unix={time.player2} 
                            active={activePlayer === 'player2'} 
                            reloadGame={reloadGame}
                        />
                    </span>
                </h2>

                {/* <div id="move-controls">
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

                <MoveList moves={moves} />  */}
            </div>
        );
    }
}

export default Scoreboard;