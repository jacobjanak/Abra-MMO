import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import API from '../../API';
import Tile from './components/Tile';

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

class Game extends Component {
  state = {
    width: 19, // should be an odd number
    tileSize: 50,
    player1: false,
    player2: false,
    moves: [],
    tiles: [],
  };

  // keep track of a1 tile for move notation
  a1 = false;

  componentWillMount() {
    this.a1 = this.findMiddle();

    API.getUser()
    .then(res => {
      const user = res.data;
      if (user.game) {
        API.joinGame(user.game, (game, newMove) => {
          if (game) {
            this.setState({ ...game }, () => {
              this.mapMovesToTiles()
            })
          }
          else if (newMove) {
            this.setState(state => {
              state.moves.push(newMove)
              const index = this.moveToIndex(newMove);
              state.tiles[index].owner = state.moves.length % 2 === 0 ? 'player1' : 'player2';
              return state;
            })
          }
        })
      }
    })
    .catch(err => alert('Error connecting to game'))
  }

  componentDidMount() {
    this.centerView()
  }

  centerView = () => {
    const { width, tileSize } = this.state;
    const container = ReactDOM.findDOMNode(this.refs.container);

    // NOTE: figure out a way to remove the sevens
    container.scrollTop = (width * tileSize / 2 - container.offsetHeight / 2 + 7);
    container.scrollLeft = (width * tileSize / 2 - container.offsetWidth / 2 + 7);
  };

  findMiddle = () => {
    const { width } = this.state;
    const middle = Math.floor(width ** 2 / 2);
    return middle;
  };

  mapMovesToTiles = () => {
    const { width, moves } = this.state;
    const tiles = [];

    // fill array with empty tiles
    for (let i = 0; i < width ** 2; i++) {
      tiles.push({})
    }

    moves.forEach((move, i) => {
      const index = this.moveToIndex(move, tiles);
      tiles[index].owner = i % 2 === 0 ? 'player1' : 'player2';
    })

    this.setState({ tiles })
  };

  moveToIndex = (move, optionalTiles) => {
    const tiles = optionalTiles || this.state.tiles;
    const { width } = this.state;
    let index = this.a1;

    // moves look like b2 or a1(d) so let's break it down
    const re = /([a-z]*)(\d*)(\([a-z]\))?/;
    // match looks like ['a1(d)', 'a', '1', '(d)']
    const match = move.match(re);
    const direction = match[3];

    if (direction) {
      index += direction === '(d)' ? width : -1;
    } else {
      const row = Number(match[2]) - 1;
      const column = alphabet.indexOf(match[1]); // NOTE: will break on aa
      index += -(row * width) + column;

      console.log(this.state.tiles)
      console.log(index)

      // need to add row or column if tile is taken
      if (tiles[index].owner) {
        // update a1 tile
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

  makeMove = index => {
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

    API.move(move)
  }

  render() {
    const { width, tileSize, tiles } = this.state;

    const gameStyles = {
      width: width * tileSize,
      height: width * tileSize,
    };

    return (
      <div>
        <div>
          <span>player: {this.state.player1.username} </span>
          <span>player: {this.state.player2.username}</span>
        </div>

        { this.state.moves.map((move, i) => (
          <span key={i}>{move} </span>
        ))}

        <div id="game-container" ref="container">
          <div id="game" style={gameStyles}>
            { tiles.map((tile, i) => (
              <Tile {...tile} makeMove={this.makeMove} index={i} key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
