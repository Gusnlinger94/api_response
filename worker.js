const EventEmitter = require('events');

const convertAmericanToDecimal = (odds) => {
    if (Math.sign(odds) === 1 && Math.abs(odds) !== 100) {
        return ((odds / 100) + 1);
    } if (Math.sign(odds) === -1 && Math.abs(odds) !== 100) {
        return ((100 / -odds) + 1);
    }
    return 2.00;
};

const makeGameDecimal = (game) => {
    // returns the same game
    // except for each key that includes Price - homeMoneylinePrice, awayMoneylinePrice, etc.
    // should be converted to decimal odds via the above function
    // convert american to decimal
    return game;
}

class testEmitter extends EventEmitter {}

const myEmitter = new testEmitter();

myEmitter.on('event', (game) => {
    const decimalGame = makeGameDecimal(game);
    console.log(decimalGame);
});

module.exports = myEmitter;
