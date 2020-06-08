import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import abraLogic from '../../../abra-logic/';
import Tile from './Tile';

class Board extends Component {
  constructor() {
    super()
    const width = 39; // must be an odd number
    const middleTile = Math.ceil(width ** 2 / 2);
    this.state = {
      width,
      middleTile,
      lastMove: -1,
      tileSize: 50,
      tiles: [],
      moveCount: 0,
    };
  }

  componentDidMount() {
    const { moves } = this.props;
    abraLogic.width = this.state.width;
    let tiles = abraLogic.movesToTiles(moves);
    tiles = abraLogic.checkAvailability(tiles); //NOTE: this will be redundant one abra-logic updates

    // find the most resent move so that we can display it differently
    const lastMove = abraLogic.moveToIndex(moves[moves.length - 1]);

    this.setState({
      tiles,
      lastMove: moves.length > 2 ? lastMove : -1
    }, this.centerView)
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
        state.lastMove = moves.length > 2 ? index : -1;

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
    container.scrollTop = halfWay - container.clientHeight / 2 - 20;
    container.scrollLeft = halfWay + tileSize / 2 + 14;
  };

  handleClick = index => {
    const move = abraLogic.indexToMove(index);
    if (!this.props.computer) {
      this.props.makeMove(move)
      // the following code could be used to do front-end checks
      // if (abraLogic.checkLegality(move, this.state.tiles)) {
        //   this.props.makeMove(move)
        // }
    } else {
      //NOTE: change the turn to the computer turn
      // probably no need to check legality but its for safety
      const { tiles } = this.state;
      if (abraLogic.checkLegality(move, tiles)) {
        if (this.props.userIsActive) {
          this.props.makeMove(move)
          setTimeout(() => {
            const move = abraLogic.computerMove(tiles);
          }, 2000)
        }
      }
      //   if (userIsActive) {
      //     this.setState({
      //       moves: [...moves, move],
      //       userIsActive: false
      //     }, () => {
      //       // check for winner
      //       const winner = abraLogic.findWinner(this.state.moves);
      //       if (winner) this.setState({ winner })
      //       else {
      //         // make computer move here
      //         abraLogic.computerMove(tiles)
      //       }
      //     })
          
          //1 make sure the client is actually a part of this game (redundant?)
          //2 validate that the correct user is sending the move (double equals is important)
          //3 check that the move is legal
          //4 add the move to the game
          //5 check if someone has won the game              
        // }
      // }
    }
  }

  render() {
    const { width, tiles, tileSize, lastMove } = this.state;
    const { winner, userIsActive, userIsPlayer1 } = this.props;

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
              userIsActive={userIsActive}
              userIsPlayer1={userIsPlayer1}
              isLastMove={lastMove === i}
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
