import React, { Component } from 'react';

class Tile extends Component {
  state = {
    available: !this.props.owner,
  };

  handleClick = () => {
    if (this.state.available) {
      this.props.makeMove(this.props.index)
    }
  };

  render() {
    const { owner } = this.props;

    if (!owner) {
      return (
        <div
          className="tile"
          onClick={this.handleClick}
        ></div>
      );
    } else {
      const style = {
        backgroundColor: owner === 'player1' ? 'red' : 'blue'
      };

      return (
        <div
          className="tile"
          style={style}
        ></div>
      );
    }
  }
}

export default Tile;
