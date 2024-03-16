const {Integer} = require("yarn/lib/cli");
const abraLogic = {
    // width: 39,

    // index of the middle tile. using get allows this to update as width changes.
    // get middle() {
    //     return Math.ceil(abraLogic.width ** 2 / 2);
    // },

    // indexToMove: index => {
    //     // get distances from the middle square
    //     const relativeX = (index % abraLogic.width) - (abraLogic.middle % abraLogic.width);
    //     const relativeY = Math.floor(abraLogic.middle / abraLogic.width) - Math.floor(index / abraLogic.width);
    //
    //     return relativeX + ',' + relativeY;
    // },

    // Checks time and moves for a winner
    // Note: this function may update the game param
    findWinner: game => {
        if (game.winner)
            return game.winner;

        // Check if a player is out of time
        const activePlayer = game.moves.length % 2 ? 'player2' : 'player1';
        const unix = new Date().getTime();
        game.time[activePlayer] -= unix - game.time.lastMove;

        if (game.time['player1'] <= 0) {
            game.time['player1'] = 0;
            game.winner = 'player2';
        }

        if (game.time['player2'] <= 0) {
            game.time['player2'] = 0;
            game.winner = 'player1';
        }

        if (game.winner)
            return game.winner;

        // Check if a player has 5 in a row
        let winner = null;
        const tiles = abraLogic.movesToTiles(game.moves);

        Object.entries(tiles).forEach((move, tile) => {
            let [x, y] = move.split(',');
            x = Integer(x);
            y = Integer(y);

            if (tile.owner) {
                // horizontal
                // tiles + 2 => "5,5" look for "7,5"
                if (tile.owner === tiles[(x+2) + ',' + y]?.owner
                    && tile.owner === tiles[(x+1) + ',' + y]?.owner
                    && tile.owner === tiles[(x-1) + ',' + y]?.owner
                    && tile.owner === tiles[(x-2) + ',' + y]?.owner) {
                    winner = tile.owner;
                }
                // vertical
                else if (tile.owner === tiles[x + ',' + (y+2)]?.owner
                    && tile.owner === tiles[x + ',' + (y+1)]?.owner
                    && tile.owner === tiles[x + ',' + (y-1)]?.owner
                    && tile.owner === tiles[x + ',' + (y-2)]?.owner) {
                    winner = tile.owner;
                }
                // diagonal
                else if (tile.owner === tiles[(x+2) + ',' + (y+2)]?.owner
                    && tile.owner === tiles[(x+1) + ',' + (y+1)]?.owner
                    && tile.owner === tiles[(x-1) + ',' + (y-1)]?.owner
                    && tile.owner === tiles[(x-2) + ',' + (y-2)]?.owner) {
                    winner = tile.owner;
                }
                // diagonal
                else if (tile.owner === tiles[(x+2) + ',' + (y-2)]?.owner
                    && tile.owner === tiles[(x+1) + ',' + (y-1)]?.owner
                    && tile.owner === tiles[(x-1) + ',' + (y+1)]?.owner
                    && tile.owner === tiles[(x-2) + ',' + (y+2)]?.owner) {
                    winner = tile.owner;
                }
            }
        })

        if (winner)
            game.winner = winner;

        return winner;
    },

    movesToTiles: moves => {
        const tiles = {};

        moves.forEach((move, i) => {
            tiles[move] = {
                owner: i % 2 === 0 ? 'player1' : 'player2',
            };
        })

        return tiles;
    },

    // moveToIndex: move => {
    //     const xy = move.split(',');
    //     return abraLogic.middle + Number(xy[0]) - (Number(xy[1]) * abraLogic.width);
    // },

    checkLegality: (move, tiles) => {
        return abraLogic.isTileAvailable(move, tiles);
    },

    isTileAvailable: (move, tiles) => {
        if (tiles[move]?.owner)
            return false;

        let [x, y] = move.split(',');
        x = Integer(x);
        y = Integer(y);

        return (
            tiles[(x+1) + ',' + y]?.owner
            || tiles[(x-1) + ',' + y]?.owner
            || tiles[x + ',' + (y+1)]?.owner
            || tiles[x + ',' + (y-1)]?.owner
        );
    },

    checkAvailability: tiles => {
        Object.keys(tiles).forEach(move => {
            const tile = tiles[move];

            if (tile.owner) {
                tile.available = false;
            }
            else if (abraLogic.isTileAvailable(move, tiles)) {
                tile.available = true;
            }
            else if (tile.available) {
                tile.available = false;
            }
        })

        return tiles;
    },

    getAvailableMoves: (moves) => {
        const availableMoves = {};

        moves.forEach(move => {
            let [x, y] = move.split(',');
            x = Integer(x);
            y = Integer(y);

            availableMoves[(x+1) + ',' + y] = true;
            availableMoves[(x-1) + ',' + y] = true;
            availableMoves[x + ',' + (y+1)] = true;
            availableMoves[x + ',' + (y-1)] = true;
        })

        for (const move in availableMoves) {
            if (moves.hasOwnProperty(move))
                delete availableMoves[move];
        }

        return availableMoves
    },

    computerMove: (tiles) => {
        const availableMoves = abraLogic.getAvailableMoves(tiles);
        const computerPlayer = Object.keys(tiles).length % 2 ? 'player2' : 'player1';

        let bestMoves = [];
        let bestScore = 0;
        for (const move of Object.keys(availableMoves)) {
            if (!abraLogic.isTileAvailable(move, tiles))
                return;

            let [x, y] = move.split(',');
            x = Integer(x);
            y = Integer(y);

            let score = 0;
            let isDefensive;

            ['right', 'left', 'up', 'down'].forEach(direction => {
                for (let i = 1; i < 5; i++) {
                    let moveToCheck;

                    switch(direction) {
                        case 'right':
                            moveToCheck = (x+i) + ',' + y;
                            break;
                        case 'left':
                            moveToCheck = (x-i) + ',' + y;
                            break;
                        case 'up':
                            moveToCheck = x + ',' + (y-i);
                            break;
                        case 'down':
                            moveToCheck = x + ',' + (y+i);
                    }

                    if (!tiles[moveToCheck]?.owner)
                        break;

                    if (tiles[moveToCheck]?.owner === computerPlayer) {
                        if (i === 1)
                            isDefensive = false;
                        else if (isDefensive)
                            break;
                    } else {
                        if (i === 1)
                            isDefensive = true;
                        else if (!isDefensive)
                            break;
                    }

                    score++;

                    // look for instant wins
                    if (!isDefensive && score === 4)
                        return move;

                    // check if this move is the best move so far
                    if (score === bestScore) {
                        bestMoves.push(move)
                    }
                    else if (score > bestScore) {
                        bestScore = score;
                        bestMoves = [move];
                    }
                }


                // for (let j = 0; j < 5; j++) {
                //
                //     let score1 = 0;
                //     if (!returnEnemyScoreInstead || (returnEnemyScoreInstead && !compIsPlayer1)) {
                //         for (let k = 0; k < 5; k++) {
                //             let index;
                //             if (direction === 0) index = i - j + k;
                //             else if (direction === 1) index = i - j * abraLogic.width + k * abraLogic.width;
                //             else if (direction === 2) index = i - j * abraLogic.width - j + k * abraLogic.width + k;
                //             else if (direction === 3) index = i - j * abraLogic.width + j + k * abraLogic.width - k;
                //
                //             if (index !== i) {
                //                 if (tiles[index].owner === 'player1') {
                //                     score1++;
                //                 } else if (tiles[index].owner === 'player2') {
                //                     if (index < i) score1 = 0;
                //                     else break;
                //                 }
                //             }
                //         }
                //     }
                //
                //     let score2 = 0;
                //     if (!returnEnemyScoreInstead || (returnEnemyScoreInstead && compIsPlayer1)) {
                //         for (let k = 0; k < 5; k++) {
                //             let index;
                //             if (direction === 0) index = i - j + k;
                //             else if (direction === 1) index = i - j * abraLogic.width + k * abraLogic.width;
                //             else if (direction === 2) index = i - j * abraLogic.width - j + k * abraLogic.width + k;
                //             else if (direction === 3) index = i - j * abraLogic.width + j + k * abraLogic.width - k;
                //
                //             if (index !== i) {
                //                 if (tiles[index].owner === 'player2') {
                //                     score2++;
                //                 } else if (tiles[index].owner === 'player1') {
                //                     if (index < i) score2 = 0;
                //                     else break;
                //                 }
                //             }
                //         }
                //     }
                //
                //     // look for instant wins
                //     if (compIsPlayer1 && score1 === 4) {
                //         bestScore = 5;
                //         bestIndexes = [i];
                //     } else if (!compIsPlayer1 && score2 === 4) {
                //         bestScore = 5;
                //         bestIndexes = [i];
                //     }
                //     else {
                //         if (score1 === bestScore)
                //             bestIndexes.push(i);
                //
                //         if (score2 === bestScore)
                //             bestIndexes.push(i);
                //
                //         if (score1 > bestScore && score1 !== avoidScore) {
                //             bestScore = score1;
                //             bestIndexes = [i];
                //         }
                //
                //         if (score2 > bestScore && score2 !== avoidScore) {
                //             bestScore = score2;
                //             bestIndexes = [i];
                //         }
                //     }
                // }
            })
        }

        // if (returnEnemyScoreInstead)
        //     return bestScore;

        const randomIndex = Math.floor(Math.random() * bestMoves.length);
        return bestMoves[randomIndex];
    }
};

module.exports = abraLogic;
