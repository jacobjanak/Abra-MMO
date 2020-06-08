const abraLogic = {
    width: 39,

    // index of the middle tile. using get allows this to update as width changes.
    get middle() {
        return Math.ceil(abraLogic.width ** 2 / 2);
    },

    indexToMove: index => {
        // get distances from the middle square
        const relativeX = (index % abraLogic.width) - (abraLogic.middle % abraLogic.width);
        const relativeY = Math.floor(abraLogic.middle / abraLogic.width) - Math.floor(index / abraLogic.width);
      
        const move = relativeX + ',' + relativeY;
    
        return move;
    },

    findWinner: moves => {
        let winner = false;
        const tiles = abraLogic.movesToTiles(moves);

        tiles.forEach((tile, i) => {
            if (tile.owner) {
                // horizontal
                if (tile.owner === tiles[i + 2].owner
                    && tile.owner === tiles[i + 1].owner
                    && tile.owner === tiles[i - 1].owner
                    && tile.owner === tiles[i - 2].owner) {
                    winner = tile.owner;
                }
                // vertical
                else if (tile.owner === tiles[i + abraLogic.width * 2].owner
                    && tile.owner === tiles[i + abraLogic.width].owner
                    && tile.owner === tiles[i - abraLogic.width].owner
                    && tile.owner === tiles[i - abraLogic.width * 2].owner) {
                    winner = tile.owner;
                }
                // diagonal
                else if (tile.owner === tiles[i + abraLogic.width * 2 - 2].owner
                    && tile.owner === tiles[i + abraLogic.width - 1].owner
                    && tile.owner === tiles[i - abraLogic.width + 1].owner
                    && tile.owner === tiles[i - abraLogic.width * 2 + 2].owner) {
                    winner = tile.owner;
                }
                // diagonal
                else if (tile.owner === tiles[i + abraLogic.width * 2 + 2].owner
                    && tile.owner === tiles[i + abraLogic.width + 1].owner
                    && tile.owner === tiles[i - abraLogic.width - 1].owner
                    && tile.owner === tiles[i - abraLogic.width * 2 - 2].owner) {
                    winner = tile.owner;
                }
            }
        })

        return winner;
    },

    movesToTiles: moves => {
        const tiles = [];

        for (let i = 0; i < abraLogic.width ** 2; i++) {
            tiles.push({})
        }

        moves.forEach((move, i) => {
            const tileIndex = abraLogic.moveToIndex(move, tiles);
            tiles[tileIndex].owner = i % 2 === 0 ? 'player1' : 'player2';
        })

        return abraLogic.checkAvailability(tiles);
    },

    moveToIndex: move => {
        const xy = move.split(',');
        const index = abraLogic.middle + Number(xy[0]) - (Number(xy[1]) * abraLogic.width);

        return index;
    },

    checkLegality: (move, movesOrTiles) => {
        let tiles;
        const index = abraLogic.moveToIndex(move);

        // if movesOrTiles is moves then convert it to tiles
        if (typeof movesOrTiles[0] === "string") {
            tiles = abraLogic.movesToTiles(movesOrTiles);
        } else {
            tiles = movesOrTiles;
        }

        // not legal to move to a taken tile
        if (tiles[index].owner) return false;

        // check wether or not each tile is available
        tiles = abraLogic.checkAvailability(tiles);
        if (tiles[index].available) {
            return true
        } else {
            return false;
        }
    },

    checkAvailability: tiles => {
        tiles.forEach((tile, i) => {
            if (tile.owner) {
                return tile.available = false
            }
      
            // check all 4 neighbouring tiles
            if (i >= abraLogic.width && tiles[i - abraLogic.width].owner) {
                tile.available = true; // up
            }
            else if (i < abraLogic.width * (abraLogic.width - 1) && tiles[i + abraLogic.width].owner) {
                tile.available = true; // down
            }
            else if (i % abraLogic.width !== 0 && tiles[i - 1].owner) {
                tile.available = true; // left
            }
            else if (i % abraLogic.width !== abraLogic.width - 1 && tiles[i + 1].owner) {
                tile.available = true; // right
            }
            else if (tile.available) {
                tile.available = false;
            }
        })

        return tiles;
    },

    computerMove: tiles => {
        // if movesOrTiles is moves then convert it to tiles
        // if (typeof movesOrTiles[0] === "string") {
        //     tiles = abraLogic.movesToTiles(movesOrTiles);
        // } else {
        //     tiles = movesOrTiles;
        // }

        let bestIndex = [];
        let bestScore = 0;
        tiles.forEach((tile, i) => {
            if (tile.available) {
                for (let direction = 0; direction < 4; direction++) {
                    for (let j = 0; j < 5; j++) {

                        let score1 = 0;
                        for (let k = 0; k < 5; k++) {
                            let index;
                            if (direction === 0) index = i - j + k;
                            else if (direction === 1) index = i - j * abraLogic.width + k * abraLogic.width;
                            else if (direction === 2) index = i - j * abraLogic.width - j + k * abraLogic.width + k;
                            else if (direction === 3) index = i - j * abraLogic.width + j + k * abraLogic.width - k;
                            if (index != i) {
                                if (tiles[index].owner === 'player1') {
                                    score1++;
                                }
                                else if (tiles[index].owner === 'player2') {
                                    if (index < i) score1 = 0;
                                    else break;
                                }
                            }
                        }

                        let score2 = 0;
                        for (let k = 0; k < 5; k++) {             
                            let index;
                            if (direction === 0) index = i - j + k;
                            else if (direction === 1) index = i - j * abraLogic.width + k * abraLogic.width;
                            else if (direction === 2) index = i - j * abraLogic.width - j + k * abraLogic.width + k;
                            else if (direction === 3) index = i - j * abraLogic.width + j + k * abraLogic.width - k;
                            if (index != i) {
                                if (tiles[index].owner === 'player2') {
                                    score2++;
                                }
                                else if (tiles[index].owner === 'player1') {
                                    if (index < i) score2 = 0;
                                    else break;
                                }
                            }
                        }

                        if (score1 === bestScore) {
                            bestIndex.push(i)
                        }
                        if (score2 === bestScore) {
                            bestIndex.push(i)
                        }
                        if (score1 > bestScore) {
                            bestScore = score1;
                            bestIndex = [i];
                        }
                        if (score2 > bestScore) {
                            bestScore = score2;
                            bestIndex = [i];
                        }
                    }
                }
            }
        })

        const result = bestIndex[Math.floor(Math.random() * bestIndex.length)];
        return abraLogic.indexToMove(result);
    }

};

module.exports = abraLogic;