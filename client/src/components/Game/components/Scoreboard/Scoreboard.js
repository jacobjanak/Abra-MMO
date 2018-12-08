import React, { Component } from 'react';
import './Scoreboard.css';

class Scoreboard extends Component {
    state = {

    };

    formatMove = move => {
        const xy = move.split(',');
        let formatted = '(';

        for (let i = 0; i < xy.length; i++) {
            if (xy[i].length === 1) {
                formatted += ' ' + xy[i] + ' ';
            }
            else if (xy[i].length === 2) {
                formatted += ' ' + xy[i];
            }
            else if (xy[i].length >= 3) {
                formatted += xy[i];
            }
            if (i === 0) formatted += ',';
        }

        formatted += ')';

        return formatted;
    }

    render() {
        const { player1, player2, moves, winner }= this.props;

        const moveListContent = [];
        for (let i = 0; i < moves.length; i += 2) {
            console.log(i)
            moveListContent.push(() => (
                <div className="move-row">
                    <span className="move-number">{Math.floor(i / 2) + 1}.</span>
                    <span className="move">{ this.formatMove(moves[i]) }</span>
                    <span className="move">
                        {
                          moves[i + 1]
                          ? this.formatMove(moves[i + 1])
                          : <span style={{ color: 'white' }}>{ this.formatMove('0,0') }</span>
                        }
                    </span>
                </div>
            ))
        }

        return (
            <div id="scoreboard">
                <p className="lead">
                    {player1.username}
                    <span className="timer">3:43</span>
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
                <div id="move-list-container">
                    <div id="move-list">
                        { moveListContent.map((Move, i) => (
                            <Move key={i} />
                        ))}
                    </div>
                </div>
                <p className="lead">
                    {player2.username}
                    <span className="timer">5:07</span>
                </p>
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