const game = {
    width: 19,

    get middle() {
        // index of the middle tile
        return Math.ceil(this.width ** 2 / 2);
    },

    findWinner: moves => {
        /*
            Here I am checking if either player has 5 tiles in a row.
            I am using the outer for loop so that the code runs once for each player.
        */

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < moves.length; i += 2) {

            }
        }
    },

    movesToTiles: moves => {
        const tiles = [];

        for (let i = 0; i < width ** 2; i++) {
            tiles.push({})
        }

        moves.forEach((move, i) => {
            const tileIndex = this.moveToIndex(move, tiles);
            tiles[tileIndex].owner = i % 2 === 0 ? 'player1' : 'player2';
        })

        return tiles;
    },

    moveToIndex: move => {
        const xy = move.split(',');
        const index = middleTile + Number(xy[0]) - (Number(xy[1]) * this.width);

        return index;
    }

};

console.log(game.middle)

module.exports = game;