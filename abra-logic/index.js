const abraLogic = {
    width: 19,

    get middle() {
        // index of the middle tile
        return Math.ceil(abraLogic.width ** 2 / 2);
    },

    findWinner: moves => {
        /*
            Here I am checking if either player has 5 tiles in a row.
            I am using the outer for loop so that the code runs once for each player.
        */

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

        return tiles;
    },

    moveToIndex: move => {
        const xy = move.split(',');
        const index = abraLogic.middle + Number(xy[0]) - (Number(xy[1]) * abraLogic.width);

        return index;
    }

};

console.log(abraLogic.middle)

module.exports = abraLogic;