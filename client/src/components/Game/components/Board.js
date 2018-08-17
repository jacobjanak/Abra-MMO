import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tile from './Tile';
import alphabet from '../data/alphabet'

class Board extends Component {
  state = {
    width: 19, // should be an odd number
    tileSize: 50,
    tiles: [],
    moveCount: 0,
  };

  // keep track of a1 tile for move notation
  a1 = false;

  componentDidMount() {
    this.a1 = this.findMiddle();
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

  findMiddle = () => {
    const { width } = this.state;
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
    const tiles = optionalTiles || this.state.tiles;
    const { width } = this.state;
    let index = this.a1;

    // moves look like b2 or a1(d) so let's break it down
    const re = /([a-z]*)(\d*)(\([a-z]\))?/;
    const match = move.match(re); // ex: ['a1(d)', 'a', '1', '(d)']

    const direction = match[3];
    if (direction) {
      index += direction === '(d)' ? width : -1;
    } else {
      const row = Number(match[2]) - 1;
      const column = alphabet.indexOf(match[1]); // NOTE: will break on aa
      index += -(row * width) + column;

      // need to add row or column if tile is taken
      if (tiles[index].owner) {
        this.a1 += row === 0 ? width : -1;
        index += row === 0 ? width : -1;
      }
    }

    // update the a1 tile
    if (match[1] === 'a' && match[2] === '1') {
      this.a1 = index;
    }

    return index;
  }

  indexToMove = index => {
    const { width } = this.state;

    // get distances from the a1 square
    let relativeX = (index % width) - (this.a1 % width);
    let relativeY = Math.floor(this.a1 / width) - Math.floor(index / width);

    // prevent negatives
    if (relativeX < 0) relativeX = 0;
    if (relativeY < 0) relativeY = 0;

    let move = alphabet[relativeX] + (relativeY + 1)

    // a1(l) and a1(d) edge case
    if (relativeX === 0 && relativeY === 0 && this.a1 !== index) {
      move += index > this.a1 ? '(d)' : '(l)';
    }

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
