import React, {Component} from 'react';
import abraLogic from 'abra-logic';
import Tile from './Tile';

class Board extends Component {
    state = {
        tiles: {},
        tileSize: 50,
        lastMove: -1,
        dimensions: {
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
        },
    };

    componentDidMount() {
        this.updateSelf(this.props.moves)
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.computer && !newProps.winner) {
            const winner = abraLogic.findWinner(newProps);

            if (winner)
                newProps.declareWinner(winner)
        }

        this.updateSelf(newProps.moves)
    }

    // this could be more efficient if we only processed the last move
    updateSelf = moves => {
        this.setBoardSize(moves)
        this.setTiles(moves)
        this.setLastMove(moves)
    }

    setBoardSize = moves => {
        const { tileSize, dimensions: { top, left } } = this.state;

        let topmost = 0;
        let bottommost = 0;
        let rightmost = 0;
        let leftmost = 0;

        for (let move of moves) {
            const [x, y] = abraLogic.coords(move);

            if (y < topmost)
                topmost = y;
            if (y > bottommost)
                bottommost = y;
            if (x > rightmost)
                rightmost = x;
            if (x < leftmost)
                leftmost = x;
        }

        // adjust scroll position so user doesn't notice the board size increase
        // const viewport = ReactDOM.findDOMNode(this.refs.viewport);
        //
        // if (topmost < top) {
        //     viewport.scrollTop -= tileSize * (top - topmost);
        // }
        // if (leftmost < left) {
        //     viewport.scrollTop -= tileSize * (left - leftmost);
        // }

        this.setState({
            dimensions: {
                top: topmost * -1 + 1,
                bottom: bottommost + 2,
                right: rightmost + 2,
                left: leftmost * -1 + 1,
            },
        });
    }

    setTiles = moves => {
        let tiles = abraLogic.movesToTiles(moves);
        tiles = abraLogic.addAvailableTiles(tiles);
        this.setState({ tiles })
    }

    // last move has a visual indicator so that the user knows what their opponent did
    // first two moves are made automatically, so we don't count those
    setLastMove = moves => {
        const lastMove = moves.length > 2 ? moves[moves.length - 1] : null;
        this.setState({ lastMove })
    }

    centerView = () => {
        // const {width, tileSize} = this.state;
        // const container = ReactDOM.findDOMNode(this.refs.container);
        // const halfWay = width * tileSize / 2;
        // container.scrollTop = halfWay - container.clientHeight / 2 - 20;
        // container.scrollLeft = halfWay + tileSize / 2 + 4;
    };

    handleClick = move => {
        this.props.makeMove(move)
    }

    getBoardSize = () => {
        const { tileSize, dimensions: { top, bottom, right, left } } = this.state;

        return {
            height: (top + bottom + 2) * tileSize + 1,
            width: (right + left + 2) * tileSize + 1,
        };
    }

    zoomIn = () => {
        const { tileSize } = this.state;
        this.setState({ tileSize: tileSize + 5 })
    }

    zoomOut = () => {
        const { tileSize } = this.state;
        this.setState({ tileSize: tileSize - 5 })
    }

    render() {
        const { tiles, tileSize, lastMove, dimensions: { top, left }} = this.state;
        const { winner, userIsActive, userIsPlayer1, aborted, restart } = this.props;

        const finished = winner || aborted;

        const topAdjust = (top + 1) * tileSize + 20;
        const leftAdjust = (left + 1) * tileSize;

        return (
            <div id="game-container">
                <div id="game-viewport" ref="viewport">
                    <div id="game-board" style={this.getBoardSize()}></div>

                    <div id="tile-container">
                        {Object.entries(tiles).map(([move, tile]) => (
                            <Tile
                                {...tile}
                                move={move}
                                finished={finished}
                                userIsActive={userIsActive}
                                userIsPlayer1={userIsPlayer1}
                                isLastMove={move === lastMove}
                                tileSize={tileSize}
                                topAdjust={topAdjust}
                                leftAdjust={leftAdjust}
                                key={move}
                                makeMove={this.handleClick}
                            />
                        ))}
                    </div>
                </div>

                <div id="action-bar-container">
                    <div id="action-bar">
                        { winner && (
                            <div className="center">
                                <button className="btn btn-lg btn-dark" onClick={restart}>
                                    New Game
                                </button>
                            </div>
                        )}

                        <div className="right">
                            <img className="zoom-button" src="../zoom-out.svg" alt="Zoom in" onClick={this.zoomOut} />
                            <img className="zoom-button" src="../zoom-in.svg" alt="Zoom out" onClick={this.zoomIn} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;
