import React, {Component} from 'react';

class Tile extends Component {
    state = {
        available: !this.props.owner,
    };

    handleClick = () => {
        if (this.state.available) {
            this.props.makeMove(this.props.move)
        }
    };

    render() {
        const {owner, available, winner, userIsActive, userIsPlayer1, isLastMove} = this.props;

        if (owner) {
            // user always has blue
            const style = {};
            if (userIsPlayer1) {
                style.backgroundColor = owner === 'player1' ? 'blue' : 'red';
            } else {
                style.backgroundColor = owner === 'player1' ? 'red' : 'blue';
            }

            // offCenter is just for the <Logo> component on the homepage
            if (this.props.offCenterX) {
                style.transform = "translateX(-50%)";
            }
            if (this.props.offCenterY) {
                style.transform = "translateY(-50%)";
            }

            return (
                <div className={"tile owned" + (isLastMove ? " last-move" : "")} style={style}></div>
            );
        } else if (available && !winner) {
            // user cannot click if it's not their turn
            if (userIsActive) {
                return (
                    <div className="tile available player-active" onClick={this.handleClick}></div>
                );
            } else {
                return (
                    <div className="tile available player-inactive"></div>
                );
            }
        } else {
            return (
                <div className="tile locked"></div>
            );
        }
    }
}

export default Tile;
