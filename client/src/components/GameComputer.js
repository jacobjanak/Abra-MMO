import React, {Component} from 'react';
import Board from './Board';
import Turn from './Turn/';
import abraLogic from "abra-logic";

class Game extends Component {
    constructor(props) {
        super(props)
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
        this.setState({ winner })
    };

    makeMove = move => {
        const { moves, userIsActive, winner } = this.state;
        const updatedMoves = [...moves, move];

        // this is to prevent the computer from making a move after the user has won
        // it should be improved because it's a race condition
        if (winner)
            return;

        this.setState({
            moves: updatedMoves,
            userIsActive: !userIsActive,
        })

        // make computer move after a delay to simulate thinking
        if (userIsActive) {
            setTimeout(() => {
                const computerMove = abraLogic.computerMove(updatedMoves);
                this.makeMove(computerMove)
            }, 500 + Math.random() * 1500)
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
