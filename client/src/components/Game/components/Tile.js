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
    const { owner, available } = this.props;

    if (owner) {
      const style = {
        backgroundColor: owner === 'player1' ? 'red' : 'blue'
      };

      // offCenter is just for the homepage
      if (this.props.offCenter) {
        style.transform = "translateX(-50%)";
      }
      
      return <div className="tile owned" style={style}></div>;
    }
    else if (available) {
      return <div className="tile available" onClick={this.handleClick}></div>;
    }
    else {
      return <div className="tile locked"></div>;
    }
  }
}

export default Tile;
