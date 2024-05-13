import React, {Component} from 'react';
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
            reloadGame,
            reportTimeout
        } = this.props;

        let activePlayer = moves.length % 2 ? 'player2' : 'player1';
        if (winner) activePlayer = false;

        return (
            <div id="scoreboard">
                <h5 className="username">
                    <a href={"/profile/" + player1.username}>
                        {player1.username}
                    </a>
                </h5>
                <h2
                    id={activePlayer === 'player1' ? 'active-timer' : ''}
                    className="timer"
                >
                    {time && (
                        <Timer
                            timeLeft={time.player1}
                            active={activePlayer === 'player1'}
                            lastMove={time.lastMove}
                            reloadGame={reloadGame}
                            reportTimeout={reportTimeout}
                        />
                    )}
                </h2>
                <h2 className="vs">
                    vs
                </h2>
                <h2
                    id={activePlayer === 'player2' ? 'active-timer' : ''}
                    className="timer"
                >
                    {time && (
                        <Timer
                            timeLeft={time.player2}
                            active={activePlayer === 'player2'}
                            lastMove={time.lastMove}
                            reloadGame={reloadGame}
                            reportTimeout={reportTimeout}
                        />
                    )}
                </h2>
                <h5 className="username">
                    <a href={"/profile/" + player2.username}>
                        {player2.username}
                    </a>
                </h5>
            </div>
        );
    }
}

export default Scoreboard;
