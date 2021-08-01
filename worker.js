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
    for (let key in game) {
        if (key.endsWith("Price") && game[key] === null) {
            var err = {
                msg: `The ${key} is null for the game : ${game.homeTeam.shortName} vs ${game.awayTeam.shortName}`
            }
            myEmitter.emit("err", err);
        }
        if (key.endsWith("Price") && game[key] !== null) {
            game[key] = convertAmericanToDecimal(game[key]);
        }
      }
    return game;
}

class testEmitter extends EventEmitter {}

const myEmitter = new testEmitter();

myEmitter.on('event', ({type, games}) => {
    if(type === 'gamesSortedByFavoritePrice'){
        console.log ("\n Games sorted by favorite priceline in decimals \n");
    }
    if(type === 'gamesSortedByTotal'){
        console.log('\n Games sorted by total in decimals \n');
    }
    const decimalGame = games.map(makeGameDecimal);
    console.log(decimalGame);
});

/*myEmitter.on('event', (games) => {
    const decimalGame = games.map(makeGameDecimal);
    console.log(decimalGame);
});*/

myEmitter.on('err', (err) => {
    console.log(err.msg);
});

module.exports = myEmitter;
