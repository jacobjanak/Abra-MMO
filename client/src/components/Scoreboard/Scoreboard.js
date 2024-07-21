import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Timer from '../Timer';
import './Scoreboard.css';

class Scoreboard extends Component {
    render() {
        const {
            player1,
            player2,
            moves,
            time,
            winner,
            aborted,
            reportTimeout
        } = this.props;

        let activePlayer = moves.length % 2 ? 'player2' : 'player1';
        if (winner || aborted)
            activePlayer = false;

        return (
            <div id="scoreboard">
                <h6 className="user-info">
                    <span id="player1-rating-left" className="rating">
                        ({player1.rating})
                    </span>
                    <NavLink
                        className="username"
                        to={"/profile/" + player1.username}
                    >
                        {player1.username}
                    </NavLink>
                    <span id="player1-rating-right" className="rating">
                        ({player1.rating})
                    </span>
                </h6>
                <h4
                    id={activePlayer === 'player1' ? 'active-timer' : ''}
                    className="timer"
                >
                    {time && (
                        <Timer
                            timeLeft={time.player1}
                            active={activePlayer === 'player1'}
                            lastMove={time.lastMove}
                            reportTimeout={reportTimeout}
                        />
                    )}
                </h4>
                <h4 className="vs">
                    vs
                </h4>
                <h4
                    id={activePlayer === 'player2' ? 'active-timer' : ''}
                    className="timer"
                >
                    {time && (
                        <Timer
                            timeLeft={time.player2}
                            active={activePlayer === 'player2'}
                            lastMove={time.lastMove}
                            reportTimeout={reportTimeout}
                        />
                    )}
                </h4>
                <h6 className="user-info">
                    <NavLink
                        className="username"
                        to={"/profile/" + player2.username}
                    >
                        {player2.username}
                    </NavLink>
                    <span className="rating">
                        ({player2.rating})
                    </span>
                </h6>
            </div>
        );
    }
}

export default Scoreboard;
