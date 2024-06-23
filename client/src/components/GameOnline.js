import React, {Component} from 'react';
import withAuth from './withAuth';
import API from '../API';
import Board from './Board';
import Scoreboard from './Scoreboard';

class Game extends Component {
    state = {
        queued: false,
        player1: false,
        player2: false,
        userIsPlayer1: false,
        moves: false,
        winner: false,
        aborted: false,
        playerCount: false
    };

    interval;

    componentDidMount() {
        API.getActiveGame()
            .then(res => {
                const game = res.data;
                if (game) {
                    API.joinGame(game._id, this.socketCallback)
                } else {
                    API.getPlayerCount(playerCount => {
                        this.setState({playerCount})
                    })
                }
            })
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        if (this.state.queued) {
            API.dequeue()
        }
    }

    reloadGame = () => {
        API.getGame(this.state._id)
            .then(res => {
                const game = res.data;
                if (game) {
                    this.setState({
                        moves: game.moves,
                        winner: game.winner,
                        aborted: game.aborted,
                        time: game.time
                    })
                }
            })
    }

    reportTimeout = () => {
        API.reportTimeout()
    }

    makeMove = move => {
        // server checks if the move is legal
        API.move(move)
    };

    queue = () => {
        if (!this.state.queued) {
            API.queue(this.socketCallback)
            this.setState({queued: true})
        } else {
            // they want to leave the queue so we'll refresh the window
            window.location.reload()
        }
    };

    socketCallback = (game, newMove) => {
        if (game) {
            const player1 = game.player1 ?? this.state.player1;
            const userIsPlayer1 = player1._id === this.props.user.id;

            this.setState({
                userIsPlayer1,
                ...game
            })
        }

        if (newMove) {
            this.setState(state => ({
                moves: [...state.moves, newMove.move],
                time: newMove.time
            }))
        }
    };

    render() {
        const {user} = this.props;

        const {
            player1,
            player2,
            userIsPlayer1,
            moves,
            winner,
            aborted,
            time,
            queued,
            playerCount
        } = this.state;

        // game in progress
        if (player1 && player2) {

            // check whose turn it is
            let userIsActive = false;
            if ((user.id === player1._id && moves.length % 2 === 0) ||
                (user.id === player2._id && moves.length % 2 !== 0)) {
                userIsActive = true;
            }

            return (
                <div>
                    <Scoreboard
                        player1={player1}
                        player2={player2}
                        moves={moves}
                        time={time}
                        winner={winner}
                        aborted={aborted}
                        reloadGame={this.reloadGame}
                        reportTimeout={this.reportTimeout}
                    />

                    {moves && (
                        <Board
                            moves={moves}
                            winner={winner}
                            aborted={aborted}
                            userIsActive={userIsActive}
                            userIsPlayer1={userIsPlayer1}
                            makeMove={this.makeMove}
                        />
                    )}
                </div>
            );
        } else {
            // no game, user should queue up
            const style = {
                textAlign: 'center',
            };

            return (
                <div className="container pt-4" style={style}>
                    <h1 className="display-4">Play now</h1>
                    {(typeof playerCount === 'number') && (
                        <p className="lead mb-0">
                            {playerCount} players currently online
                        </p>
                    )}
                    <button
                        className={"mt-5 btn btn-lg btn-" + (queued ? 'secondary' : 'primary')}
                        onClick={this.queue}
                    >
                        {queued ? "Leave queue" : "Enter queue"}
                    </button>
                    {queued && (
                        <div>
                            <img src="spinner.gif" alt="Loading" height="140"/>
                        </div>
                    )}
                </div>
            );
        }
    }
}

export default withAuth(Game);
