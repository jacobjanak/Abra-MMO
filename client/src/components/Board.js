import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import abraLogic from 'abra-logic';
import Tile from './Tile';
import {left} from "yarn/lib/cli";

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tiles: {},
            tileSize: 50,
            lastMove: -1,
            boardWidth: 0,
            boardHeight: 0,
        };
    }

    componentDidMount() {
        this.updateSelf(this.props.moves)
    }

    UNSAFE_componentWillReceiveProps(prevProps) {
        // check for winner in player vs computer
        // TODO: I should move this
        if (prevProps.computer && !prevProps.winner) {
            const winner = abraLogic.findWinner(prevProps);

            if (winner)
                prevProps.declareWinner(winner)
        }

        if (prevProps.moves)
            this.updateSelf(prevProps.moves)
    }

    // this could be more efficient if we only processed the last move
    updateSelf = moves => {
        this.setBoardSize(moves)
        this.setTiles(moves)
        this.setLastMove(moves)
    }

    setBoardSize = moves => {
        let topmost = 0;
        let bottommost = 0;
        let rightmost = 0;
        let leftmost = 0;

        for (let move of moves) {
            let [x, y] = move.split(',');
            x = parseInt(x);
            y = parseInt(y);

            if (y < topmost)
                topmost = y;
            if (y > bottommost)
                bottommost = y;
            if (x > rightmost)
                rightmost = x;
            if (x < leftmost)
                leftmost = x;
        }

        this.setState({
            boardHeight: Math.abs(topmost - bottommost),
            boardWidth: Math.abs(rightmost - leftmost),
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

    getContainerStyle = () => {
        const { boardHeight, boardWidth, tileSize } = this.state;

        return {
            height: boardHeight * tileSize + 'px',
            width: boardWidth * tileSize + 'px',
        };
    }

    getGameStyle = () => {
        const { tileSize } = this.state;

        return {
            transform: `translate(-${tileSize / 2}px, -${tileSize / 2}px)`,
        };
    }

    render() {
        const { tiles, tileSize, lastMove } = this.state;
        const { winner, userIsActive, userIsPlayer1 } = this.props;

        return (
            <div id="game-container" ref="container" style={this.getContainerStyle()}>
                <div id="game" style={this.getGameStyle()}>
                    {Object.entries(tiles).map(([move, tile]) => (
                        <Tile
                            {...tile}
                            move={move}
                            winner={winner}
                            userIsActive={userIsActive}
                            userIsPlayer1={userIsPlayer1}
                            isLastMove={move === lastMove}
                            tileSize={tileSize}
                            key={move}
                            makeMove={this.handleClick}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Board;
