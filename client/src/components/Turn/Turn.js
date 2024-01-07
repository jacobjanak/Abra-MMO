import React, {Component} from 'react';
import './Turn.css';

class Turn extends Component {
    render() {
        const {movesLength, userIsActive, winner} = this.props;

        let message;
        if (userIsActive) message = "Your turn";
        else message = "Computer thinking...";
        if (movesLength === 2) message = "Connect 5 in a row";
        if (winner) {
            if (userIsActive) message = "You lose";
            else message = "You win!";
        }


        return (
            <h2 id="turn">{message}</h2>
        );
    }
}

export default Turn;
