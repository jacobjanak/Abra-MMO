import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import abraLogic from 'abra-logic';
import Tile from './Tile';

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tiles: {},
            tileSize: 50,
            lastMove: -1,
            moveCount: 0,
        };
    }

    componentDidMount() {
        const { moves } = this.props;
        const tiles = abraLogic.movesToTiles(moves);

        // find the most recent move so that we can display it differently
        const lastMove = moves[moves.length - 1];

        this.setState({
            tiles: abraLogic.addAvailableTiles(tiles),
            lastMove: moves.length > 2 ? lastMove : -1
        }, this.centerView)
    }

    UNSAFE_componentWillReceiveProps(prevProps) {
        // check if a winner was just announced due to time out
        // if (prevProps.winner) {
        //     this.setState({
        //         tiles: abraLogic.addAvailableTiles(this.state.tiles) // TODO: why?
        //     })
        // }

        // check for winner in player vs computer
        if (prevProps.computer && !prevProps.winner) {
            const winner = abraLogic.findWinner(prevProps); //

            if (winner)
                prevProps.declareWinner(winner)
        }

        // check if new move was sent
        const moves = prevProps.moves;
        if (moves) {
            const newMove = moves[moves.length - 1];
            const player = moves.length % 2 ? 'player1' : 'player2'

            const tiles = this.state.tiles;
            tiles[newMove] = { owner: player };

            this.setState({
                tiles: abraLogic.addAvailableTiles(tiles),
                lastMove: moves.length > 2 ? newMove : null,
            });
        }
    }

    centerView = () => {
        // const {width, tileSize} = this.state;
        // const container = ReactDOM.findDOMNode(this.refs.container);
        // const halfWay = width * tileSize / 2;
        // container.scrollTop = halfWay - container.clientHeight / 2 - 20;
        // container.scrollLeft = halfWay + tileSize / 2 + 4;
    };

    handleClick = move => {
        const { computer, moves, userIsActive, winner, makeMove } = this.props;

        // <Tile> already checks this, but might as well double check
        if (!userIsActive || winner)
            return;

        // for online games, we let the server handle all the safety checking
        if (!computer) {
            makeMove(move)
            return;
        }

        // probably no need to check legality, but it's for safety
        const { tiles } = this.state;
        if (abraLogic.checkLegality(move, tiles)) {
            makeMove(move)
            moves.push(move)

            // computer should make a move after a random delay
            const computerMove = abraLogic.computerMove(moves);
            setTimeout(() => makeMove(computerMove), 500 + Math.random() * 1500)
        }
    }

    render() {
        const { tiles, tileSize, lastMove } = this.state;
        const { winner, userIsActive, userIsPlayer1 } = this.props;

        const gameStyles = {
            transform: `translate(-${tileSize / 2}px, -${tileSize / 2}px)`,
        };

        return (
            <div id="game-container" ref="container">
                <div id="game" style={gameStyles}>
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
