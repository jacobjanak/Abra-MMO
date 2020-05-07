import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import abraLogic from 'abra-logic';
import Tile from './Tile';

class Board extends Component {
  constructor() {
    super()

    const width = 39; // must be an odd number
    const middleTile = Math.ceil(width ** 2 / 2);

    this.state = {
      width,
      middleTile,
      tileSize: 50,
      tiles: [],
      moveCount: 0,
    };
  }

  componentDidMount() {
    abraLogic.width = this.state.width;
    let tiles = abraLogic.movesToTiles(this.props.moves);
    tiles = abraLogic.checkAvailability(tiles); //NOTE: this will be redundant one abra-logic updates

    this.setState({ tiles }, this.centerView)
  }

  componentWillReceiveProps(prevProps) {
    // check if a winner was just announced due to time out
    if (prevProps.winner) {
      this.setState({
        tiles: abraLogic.checkAvailability(this.state.tiles)
      })
    }

    // NOTE: this function is only setup to handle one move which may cause issues
    // check if new move was sent
    const moves = prevProps.moves;
    if (moves) {
      const index = abraLogic.moveToIndex(moves[moves.length - 1]);

      const player = moves.length % 2 === 1 ? 'player1' : 'player2'
      this.setState(state => {
        state.tiles[index].owner = player;

        // check if the board size needs to be increased
        // if (index % this.state.width <= 0
        //   || index % this.state.width >= this.state.width - 1
        //   || index < this.state.width
        //   || index >= this.state.width ** 2 - this.state.width) {

        //   // this guarantees the width will be odd
        //   state.width = abraLogic.width = abraLogic.width * 2 - 1;
        //   state.middleTile = Math.ceil(state.width ** 2 / 2);

        //   // remake tiles with new larger width
        //   state.tiles = abraLogic.movesToTiles(moves);

        //   // need to increase the width on initial startup
        //   // need to tell server to increase the width
        // }

        state.tiles = abraLogic.checkAvailability(state.tiles);
        return state;
      })
    }
  }

  centerView = () => {
    const { width, tileSize } = this.state;
    const container = ReactDOM.findDOMNode(this.refs.container);

    const halfWay = width * tileSize / 2;
    container.scrollTop = halfWay - container.clientHeight / 2;
    container.scrollLeft = halfWay + tileSize / 2 + 25;
    // #game has padding left/right so there's no need to subtract anything
    // not sure why adding 25 works but it makes it perfect
  };

  handleClick = index => {
    const move = abraLogic.indexToMove(index);
    this.props.makeMove(move)
  }

  render() {
    const { width, tiles, tileSize } = this.state;
    const { winner, userIsPlayer1 } = this.props;

    const gameStyles = {
      width: width * tileSize,
      height: width * tileSize,
    };

    return (
      <div id="game-container" ref="container">
        <div id="game" style={gameStyles}>
          { tiles.map((tile, i) => (
            <Tile
              {...tile}
              winner={winner}
              userIsPlayer1={userIsPlayer1}
              index={i}
              key={i}
              makeMove={this.handleClick}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
