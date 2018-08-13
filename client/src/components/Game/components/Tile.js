import React, Component from 'react';

class Tile extends Component {
  state = {
    owner: null
  };

  render() {
    return (
      <div className="tile"></div>
    );
  }
}

export default Tile;
