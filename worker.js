const EventEmitter = require('events');

const convertAmericanToDecimal = (odds) => {
    if (Math.sign(odds) === 1 && Math.abs(odds) !== 100) {
        return odds / 100 + 1;
    }
    if (Math.sign(odds) === -1 && Math.abs(odds) !== 100) {
        return 100 / -odds + 1;
    }
    return 2.0;
};

const makeGameDecimal = (game) => {
    // returns the same game
    // except for each key that includes Price - homeMoneylinePrice, awayMoneylinePrice, etc.
    // should be converted to decimal odds via the above function
    // convert american to decimal
    Object.keys(game).forEach((k) => {
        if (k.endsWith('Price') && game[k]) {
            game[k] = convertAmericanToDecimal(game[k]);
        }
    });
    return game;
};

const checkForRequiredKeys = (game) => {
    Object.keys(game).every((k) => {
        if (k.endsWith('Price') && game[k] === null) {
            myEmitter.emit(
                'error',
                new Error(
                    `Price field(s) is null for the ${game.homeTeam.longName} vs ${game.awayTeam.longName} game.`
                )
            );
            return false;
        }
        return true;
    });
};

class testEmitter extends EventEmitter {}

const myEmitter = new testEmitter();

myEmitter.on('event', ({ type, games }) => {
    games.map(checkForRequiredKeys);
    const decimalGames = games.map(makeGameDecimal);
    myEmitter.emit('decimalGames', { type, decimalGames });
});

module.exports = myEmitter;
