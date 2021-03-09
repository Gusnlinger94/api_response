const fs = require('fs');

/*
    {
        startTime: Date,
        homeTeam: {
            longName: String,
            shortName: String,
            rotationNumber: String,
        },
        awayTeam: {
            longName: String,
            shortName: String,
            rotationNumber: String,
        },
        offTheBoard: Boolean => returns true only if the game has none of the below odds
        homeMoneylinePrice: Number,
        firstPeriodHomeMoneylinePrice: Number,
        awayMoneylinePrice: Number,
        firstPeriodAwayMoneylinePrice: Number,
        homeTeamSpread: Number,
        awayTeamSpread: Number,
        homeSpreadPrice: Number,
        awaySpreadPrice: Number,
        total: Number,
        overPrice: Number,
        underPrice: Number,
    }
*/

function renderGame(game) {
    // should return a game object defined by the above schema
    // if a field is not available it should be null
    const renderedGame = {};
    renderedGame.homeMoneylinePrice = game.Lines[0].Hoddst || null;
    return renderedGame;
}

(function run() {
    // this script reads data from the provided file
    // and parses it into json
    // the data is a list of NHL games

    // first, read the data
    const data = fs.readFileSync('./jazz_response.json');
    const rawGames = JSON.parse(data);

    // next, for every game, render an object that is more human readable
    // and easier to work with, an example schema is listed above
    // a mapper function renderGame
    const parsedGames = rawGames.map(renderGame);
    console.log(parsedGames);

    // also let's sort these games in 2 different ways

    // How likely the favorite is to win
    // First, determine who the favorite is - this is whoever's moneyline odds are most negative
    // A team with moneyline odds -140 is favored over a team with moneyline odds +125
    // Then, sort so that the game with the biggest favorite comes first
    // And the game with the smallest favorite comes last (Rangers -120 @ Devils +100)
    // console.log(gamesSortedByFavoritePrice);


    // Second, sort the games from highest total to lowest total
    // If a game has a total of 6.5, it should come before a game with a total of 5.5
    // If 2 games have the same total, they should be sorted by overPrice in ascending order
    // ex: O 6.5 -115 comes before O 6.5 -105
    // console.log(gamesSortedByTotal)



    // Now pass off each of these arrays to a "worker"
    // and map every game to the makeGameDecimal function
    // the worker should throw and catch an exception
    // if any of the "price" fields of the game - homeMoneylinePrice, awayMoneylinePrice, etc.
    // are null

    const test_emitter = require('./worker');

    test_emitter.emit('event', '[ THIS IS A TEST GAME_OBJECT ]');

    // console.log(test_emitter);

}());
