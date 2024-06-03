import React, {Component} from 'react';
import abraLogic from 'abra-logic';

class Tile extends Component {
    handleClick = () => {
        const { owner, finished, userIsActive, move, makeMove } = this.props;

        if (!owner && !finished && userIsActive)
            makeMove(move)
    };

    getClassName = () => {
        const { owner, finished, isLastMove, userIsActive } = this.props;

        const classes = ['tile'];

        if (owner) {
            classes.push('owned')

            if (isLastMove)
                classes.push('last-move')
        }
        else if (!finished) {
            classes.push('available')
            classes.push(userIsActive ? 'player-active' : 'player-inactive')
        }

        return classes.join(' ');
    };

    getStyle = () => {
        const { move, owner, userIsPlayer1, tileSize, topAdjust, leftAdjust } = this.props;
        const [x, y] = abraLogic.coords(move);

        const style = {
            height: tileSize + 1 + 'px',
            width: tileSize + 1 + 'px',
            top: y * tileSize + topAdjust + 'px',
            left: x * tileSize + leftAdjust + 'px',
        };

        if (owner) {
            // user is always blue and their opponent is red
            if (userIsPlayer1) {
                style.backgroundColor = owner === 'player1' ? '#3498DB' : '#E74C3C';
            } else {
                style.backgroundColor = owner === 'player1' ? '#E74C3C' : '#3498DB';
            }
        }

        return style;
    };

    render() {
        return (
            <div
                className={this.getClassName()}
                style={this.getStyle()}
                onClick={this.handleClick}
            ></div>
        );
    }
}

export default Tile;
