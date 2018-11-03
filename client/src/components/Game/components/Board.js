import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tile from './Tile';
import alphabet from '../data/alphabet'

class Board extends Component {
  constructor() {
    super()

    const width = 19; // should be an odd number

    this.state = {
      width: width,
      tileSize: 50,
      tiles: [],
      middleTile: this.findMiddle(width),
      moveCount: 0,
    };
  }

  componentDidMount() {
    this.movesToTiles()
    this.centerView()
    this.setState(state => {
      state.tiles = this.checkAvailability(state.tiles);
      return state;
    })
  }

  componentDidUpdate() {
    // this runs when the socket recieves a new move
    // NOTE: should this function handle multiple moves??
    const { moveCount } = this.state;
    const { moves } = this.props;
    if (moves.length !== moveCount) {
      const index = this.moveToIndex(moves[moves.length - 1]);
      const player = moves.length % 2 === 1 ? 'player1' : 'player2'
      this.setState(state => {
        state.tiles[index].owner = player;
        state.tiles = this.checkAvailability(state.tiles);
        state.moveCount = moves.length;
        return state;
      })
    }
  }

  findMiddle = width => {
    const middle = Math.floor(width ** 2 / 2);
    return middle;
  };

  centerView = () => {
    const { width, tileSize } = this.state;
    const container = ReactDOM.findDOMNode(this.refs.container);

    // NOTE: figure out a way to remove the sevens
    container.scrollTop = (width * tileSize / 2 - container.offsetHeight / 2 + 7);
    container.scrollLeft = (width * tileSize / 2 - container.offsetWidth / 2 + 7);
  };

  movesToTiles = () => {
    const { width } = this.state;
    const { moves } = this.props;
    const tiles = [];

    // fill array with empty tiles NOTE: does it have to be empty objects?
    for (let i = 0; i < width ** 2; i++) {
      tiles.push({})
    }

    moves.forEach((move, i) => {
      const index = this.moveToIndex(move, tiles);
      tiles[index].owner = i % 2 === 0 ? 'player1' : 'player2';
    })

    this.setState({ tiles, moveCount: moves.length })
  };

  moveToIndex = (move, optionalTiles) => {
    console.log('move', move)
    const tiles = optionalTiles || this.state.tiles;
    const { width, middleTile } = this.state;

    const xy = move.split(',');

    let index = middleTile + Number(xy[0]) + (Number(xy[1]) * width);

    return index;
  }

  indexToMove = index => {
    const { width } = this.state;

    // get distances from the middle square
    let relativeX = (index % width) - (this.middleTile % width);
    let relativeY = Math.floor(this.middleTile / width) - Math.floor(index / width);

    const move = relativeX + ',' + relativeY;
    console.log("move: ", move)

    return move;
  }

  handleClick = index => {
    const move = this.indexToMove(index);
    this.props.makeMove(move)
  }

  checkAvailability = tiles => {
    const { width } = this.state;

    tiles.forEach((tile, i) => {
      if (tile.owner) {
        return tile.available = false
      }

      // check all 4 neighbouring tiles
      if (i >= width && tiles[i - width].owner) {
        tile.available = true; // up
      }
      else if (i < width * (width - 1) && tiles[i + width].owner) {
        tile.available = true; // down
      }
      else if (i % width !== 0 && tiles[i - 1].owner) {
        tile.available = true; // left
      }
      else if (i % width !== width - 1 && tiles[i + 1].owner) {
        tile.available = true; // right
      }
      else if (tile.available) {
        tile.available = false;
      }
    })

    return tiles;
  };

  render() {
    const { width, tiles, tileSize } = this.state;

    const gameStyles = {
      width: width * tileSize,
      height: width * tileSize,
    };

    return (
      <div id="game-container" ref="container">
        <div id="game" style={gameStyles}>
          { tiles.map((tile, i) => (
            <Tile {...tile} makeMove={this.handleClick} index={i} key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
