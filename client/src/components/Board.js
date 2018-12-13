import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tile from './Tile';

class Board extends Component {
  constructor() {
    super()

    const width = 19; // must be an odd number
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
    this.movesToTiles()
    this.centerView()
    this.setState(state => {
      state.tiles = this.checkAvailability(state.tiles);
      return state;
    })
  }

  componentWillReceiveProps(prevProps) {
    // check if a winner was just announced, usually due to time out
    console.log(prevProps)
    if (prevProps.winner) {
      this.setState({
        tiles: this.checkAvailability(this.state.tiles)
      })
    }

    // NOTE: this function is only setup to handle one move which may cause issues
    // check if new move was sent
    const moves = prevProps.moves;
    if (moves) {
      const index = this.moveToIndex(moves[moves.length - 1]);
      const player = moves.length % 2 === 1 ? 'player1' : 'player2'
      this.setState(state => {
        state.tiles[index].owner = player;
        state.tiles = this.checkAvailability(state.tiles);
        return state;
      })
    }
  }

  // componentDidUpdate() {
  //   // NOTE: couldn't this be componentWillReceiveProps instead?
  //   // NOTE: this function is only setup to handle one move which may cause issues
  //   const { moveCount } = this.state;
  //   const { moves, winner } = this.props;

  //   // check if new move was sent
  //   if (moves.length !== moveCount) {
  //     const index = this.moveToIndex(moves[moves.length - 1]);
  //     const player = moves.length % 2 === 1 ? 'player1' : 'player2'
  //     this.setState(state => {
  //       state.tiles[index].owner = player;
  //       state.tiles = this.checkAvailability(state.tiles);
  //       state.moveCount = moves.length;
  //       return state;
  //     })
  //   }
  // }

  centerView = () => {
    //NOTE: this function is not working perfectly. The game looks slightly off-center
    const { width, tileSize } = this.state;
    const container = ReactDOM.findDOMNode(this.refs.container);

    const halfWay = width * tileSize / 2;
    container.scrollTop = halfWay - container.clientHeight / 2;
    container.scrollLeft = halfWay + tileSize / 2 + 25;
    // #game has padding left/right so there's no need to subtract anything
    // not sure why adding 25 works but it makes it perfect
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
    const { width, middleTile } = this.state;
    const xy = move.split(',');

    let index = middleTile + Number(xy[0]) - (Number(xy[1]) * width);

    return index;
  }

  indexToMove = index => {
    const { width, middleTile } = this.state;

    // get distances from the middle square
    const relativeX = (index % width) - (middleTile % width);
    const relativeY = Math.floor(middleTile / width) - Math.floor(index / width);
  
    const move = relativeX + ',' + relativeY;

    return move;
  }

  handleClick = index => {
    const move = this.indexToMove(index);
    this.props.makeMove(move)
  }

  checkAvailability = tiles => {
    const { width } = this.state;
    const { winner } = this.props;

    tiles.forEach((tile, i) => {
      if (tile.owner || winner) {
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
    const { winner } = this.props;

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
