import React, {Component} from 'react';
import Board from './Board';
import Turn from './Turn/';

class Game extends Component {
    constructor(props) {
        super(props)
        this.audio = new Audio('./newmove.mp3');
        //NOTE: check localStorage for game?
        // moves = localstorage
        this.state = {
            userIsPlayer1: true,
            userIsActive: true,
            winner: false,
            moves: ['0,0', '0,1']
        };
    }

    componentWillUnmount() {
        this.setState({
            userIsPlayer1: true,
            userIsActive: true,
            winner: false,
            moves: ['0,0', '0,1']
        })
    }

    declareWinner = winner => {
        this.setState({winner})
    };

    makeMove = move => {
        const {userIsPlayer1, userIsActive, moves} = this.state;
        // user move
        if ((moves.length % 2 === 0 && userIsActive && userIsPlayer1)
            || (moves.length % 2 === 1 && userIsActive && !userIsPlayer1)) {
            this.setState({
                userIsActive: false,
                moves: [...this.state.moves, move]
            })
        }
        // computer move
        else if ((moves.length % 2 === 1 && !userIsActive && userIsPlayer1)
            || (moves.length % 2 === 0 && !userIsActive && !userIsPlayer1)) {
            this.setState({
                userIsActive: true,
                moves: [...this.state.moves, move]
            }, () => {
                // this.audio.play()
                // .catch(err => {})
            })
        }
    };

    render() {
        const {
            userIsPlayer1,
            userIsActive,
            moves,
            winner,
        } = this.state;

        return (
            <div>
                <Turn
                    movesLength={moves.length}
                    userIsActive={userIsActive}
                    winner={winner}
                />
                <Board
                    computer={true}
                    moves={moves}
                    winner={winner}
                    userIsActive={userIsActive}
                    userIsPlayer1={userIsPlayer1}
                    declareWinner={this.declareWinner}
                    makeMove={this.makeMove}
                />
            </div>
        );
    }
}

export default Game;
