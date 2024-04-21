import React, {Component} from 'react';

class Tile extends Component {
    handleClick = () => {
        const { owner, winner, userIsActive } = this.props;

        if (!owner && !winner && userIsActive)
            this.props.makeMove(this.props.move)
    };

    getClassName = () => {
        const { owner, winner, isLastMove, userIsActive } = this.props;

        const classes = ['tile'];

        if (owner) {
            classes.push('owned')

            if (isLastMove)
                classes.push('last-move')
        }
        else if (!winner) {
            classes.push('available')
            classes.push(userIsActive ? 'player-active' : 'player-inactive')
        }

        return classes.join(' ');
    };

    getStyle = () => {
        const { move, owner, userIsPlayer1, tileSize, topAdjust, leftAdjust } = this.props;

        let [x, y] = move.split(',');
        x = parseInt(x);
        y = parseInt(y);

        const style = {
            height: tileSize + 1 + 'px',
            width: tileSize + 1 + 'px',
            top: y * tileSize + topAdjust + 'px',
            left: x * tileSize + leftAdjust + 'px',
        };

        if (owner) {
            // user is always blue and their opponent is red
            if (userIsPlayer1) {
                style.backgroundColor = owner === 'player1' ? 'blue' : 'red';
            } else {
                style.backgroundColor = owner === 'player1' ? 'red' : 'blue';
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
