const abraLogic = {
    coords: move => {
        let [x, y] = move.split(',');
        x = parseInt(x);
        y = parseInt(y);

        return [x, y];
    },

    // Check if a player is out of time
    // Note: this function updates the game prop
    findTimeoutWinner: game => {
        if (game.winner || !game.time)
            return game.winner;

        const activePlayer = game.moves.length % 2 ? 'player2' : 'player1';

        if (game.time[activePlayer] - new Date().getTime() + game.time.lastMove <= 0) {
            game.time[activePlayer] = 0;
            game.winner = activePlayer;
        }

        return game.winner;
    },

    // Checks time and moves for a winner
    // Note: this function updates the game prop
    findWinner: game => {
        if (game.winner)
            return game.winner;

        // Check if a player has 5 in a row
        const tiles = abraLogic.movesToTiles(game.moves);
        for (const [move, tile] of Object.entries(tiles)) {
            if (!tile.owner)
                continue;

            const [x, y] = abraLogic.coords(move);

            // Check horizontal, vertical, and both diagonals for 5 in a row
            if (
                (
                    tile.owner === tiles[(x+2) + ',' + y]?.owner
                    && tile.owner === tiles[(x+1) + ',' + y]?.owner
                    && tile.owner === tiles[(x-1) + ',' + y]?.owner
                    && tile.owner === tiles[(x-2) + ',' + y]?.owner
                ) || (
                    tile.owner === tiles[x + ',' + (y+2)]?.owner
                    && tile.owner === tiles[x + ',' + (y+1)]?.owner
                    && tile.owner === tiles[x + ',' + (y-1)]?.owner
                    && tile.owner === tiles[x + ',' + (y-2)]?.owner
                ) || (
                    tile.owner === tiles[(x+2) + ',' + (y+2)]?.owner
                    && tile.owner === tiles[(x+1) + ',' + (y+1)]?.owner
                    && tile.owner === tiles[(x-1) + ',' + (y-1)]?.owner
                    && tile.owner === tiles[(x-2) + ',' + (y-2)]?.owner
                ) || (
                    tile.owner === tiles[(x+2) + ',' + (y-2)]?.owner
                    && tile.owner === tiles[(x+1) + ',' + (y-1)]?.owner
                    && tile.owner === tiles[(x-1) + ',' + (y+1)]?.owner
                    && tile.owner === tiles[(x-2) + ',' + (y+2)]?.owner
                )
            ) {
                game.winner = tile.owner;
                return tile.owner;
            }
        }

        return null;
    },

    movesToTiles: moves => {
        const tiles = {};

        moves.forEach((move, i) => {
            tiles[move] = {
                owner: i % 2 ? 'player2' : 'player1',
            };
        })

        return tiles;
    },

    isTileAvailable: (game, move) => {
        const tiles = abraLogic.movesToTiles(game.moves);

        if (tiles[move]?.owner)
            return false;

        const [x, y] = abraLogic.coords(move);

        return (
            tiles[(x+1) + ',' + y]?.owner
            || tiles[(x-1) + ',' + y]?.owner
            || tiles[x + ',' + (y+1)]?.owner
            || tiles[x + ',' + (y-1)]?.owner
        );
    },

    addAvailableTiles: tiles => {
        const availableMoveMap = abraLogic.getAvailableMoveMap(tiles);

        for (const move in availableMoveMap) {
            tiles[move] = { owner: null };
        }

        return tiles;
    },

    getAvailableMoveMap: (tiles) => {
        // Initial value is necessary in case there hasn't been any moves yet
        const availableMoveMap = { '0,0': true };

        for (const [move, tile] of Object.entries(tiles)) {
            if (!tile.owner)
                continue;

            const [x, y] = abraLogic.coords(move);

            availableMoveMap[(x+1) + ',' + y] = true;
            availableMoveMap[(x-1) + ',' + y] = true;
            availableMoveMap[x + ',' + (y+1)] = true;
            availableMoveMap[x + ',' + (y-1)] = true;
        }

        for (const [move, tile] of Object.entries(tiles)) {
            if (tile.owner)
                delete availableMoveMap[move];
        }

        return availableMoveMap
    },

    computerMove: moves => {
        let { bestMoves, score } = abraLogic.findBestMove(moves);

        // Instant win
        if (score === 4)
            return bestMoves[0];

        // Random shuffle
        abraLogic.shuffle(bestMoves);
        bestMoves = bestMoves.slice(0, 5);

        const badMoves = [];
        for (const move of bestMoves) {
            const opponentMove = abraLogic.findBestMove([...moves, move]);

            if (opponentMove.score !== 4)
                return move;

            badMoves.push(move);
        }

        // Often times the user creates a situation where they have 2+ winning options
        // The computer can't possibly win, so we might as well just block 1 option
        if (badMoves.length >= 2)
            return bestMoves[0];

        // No good moves were found
        bestMoves = abraLogic.findBestMove(moves, badMoves).bestMoves;

        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    },

    findBestMove: (moves, movesToSkip = []) => {
        const tiles = abraLogic.movesToTiles(moves);
        const availableMoveMap = abraLogic.getAvailableMoveMap(tiles);
        const computerPlayer = moves.length % 2 ? 'player2' : 'player1';

        let bestMoves = [];
        let bestScore = 0;
        for (const move in availableMoveMap) {
            if (movesToSkip.includes(move))
                continue;

            const [x, y] = abraLogic.coords(move);

            for (const direction of ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']) {
                let score = 0;
                let isDefensive = null;

                for (let i = 1; i < 5; i++) {
                    let moveToCheck;

                    switch(direction) {
                        case 'N':
                            moveToCheck = x + ',' + (y-i);
                            break;
                        case 'NE':
                            moveToCheck = (x+i) + ',' + (y-i);
                            break;
                        case 'E':
                            moveToCheck = (x+i) + ',' + y;
                            break;
                        case 'SE':
                            moveToCheck = (x+i) + ',' + (y+i);
                            break;
                        case 'S':
                            moveToCheck = x + ',' + (y+i);
                            break;
                        case 'SW':
                            moveToCheck = (x-i) + ',' + (y+i);
                            break;
                        case 'W':
                            moveToCheck = (x-i) + ',' + y;
                            break;
                        case 'NW':
                            moveToCheck = (x-i) + ',' + (y-i);
                            break;
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
                    if (!isDefensive && score === 4) {
                        return {
                            bestMoves: [move],
                            score,
                        };
                    }

                    // add bias to defensive moves
                    const adjustedScore = score + isDefensive * 0.1;

                    // check if this move is the best move so far
                    if (adjustedScore === bestScore) {
                        bestMoves.push(move)
                    }
                    else if (adjustedScore > bestScore) {
                        bestScore = adjustedScore;
                        bestMoves = [move];
                    }
                }
            }
        }

        return {
            bestMoves,
            score: bestScore,
        };
    },

    shuffle: arr => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    },
};

module.exports = abraLogic;
