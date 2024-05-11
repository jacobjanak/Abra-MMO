import React, {Component} from 'react';
import Timer from '../Timer';
import './Scoreboard.css';

class Scoreboard extends Component {
    render() {
        const {player1, player2, moves, time, winner, reloadGame} = this.props;

        let activePlayer = moves.length % 2 ? 'player2' : 'player1';
        if (winner) activePlayer = false;

        return (
            <div id="scoreboard">
                <h2>
                    <span className="scoreboard-item-1 py-1">
                        <a className="username" href={"/profile/" + player1.username}>
                            {player1.username}
                        </a>
                    </span>
                    <span
                        id={activePlayer === 'player1' ? 'active-timer' : ''}
                        className="scoreboard-item-2 py-1 timer"
                    >
                        {time && (
                            <Timer
                                timeLeft={time.player1}
                                active={activePlayer === 'player1'}
                                lastMove={time.lastMove}
                                reloadGame={reloadGame}
                            />
                        )}
                    </span>
                    <span className="scoreboard-item-3 py-1">
                        vs
                    </span>
                    <span
                        id={activePlayer === 'player2' ? 'active-timer' : ''}
                        className="scoreboard-item-4 py-1 timer"
                    >
                        {time && (
                            <Timer
                                timeLeft={time.player2}
                                active={activePlayer === 'player2'}
                                lastMove={time.lastMove}
                                reloadGame={reloadGame}
                            />
                        )}
                    </span>
                    <span className="scoreboard-item-5 py-1">
                        <a className="username" href={"/profile/" + player2.username}>
                          {player2.username}
                        </a>
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

                <MoveList moves={moves} /> */}
            </div>
        );
    }
}

export default Scoreboard;
