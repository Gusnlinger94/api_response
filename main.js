const fs = require('fs');

const { isExists, sortByFavoritePrice, sortByTotal } = require('./utils');
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
    const renderedGame = {
        startTime: null,
        homeTeam: {
            longName: null,
            shortName: null,
            rotationNumber: null,
        },
        awayTeam: {
            longName: null,
            shortName: null,
            rotationNumber: null,
        },
        offTheBoard: false,
        homeMoneylinePrice: null,
        firstPeriodHomeMoneylinePrice: null,
        awayMoneylinePrice: null,
        firstPeriodAwayMoneylinePrice: null,
        homeTeamSpread: null,
        awayTeamSpread: null,
        homeSpreadPrice: null,
        awaySpreadPrice: null,
        total: null,
        overPrice: null,
        underPrice: null,
    };

    // startTime
    if (isExists(game.Gmdt) && isExists(game.Gmtm)) {
        const datePattern = /(\d{4})(\d{2})(\d{2})/;
        renderedGame.startTime = new Date(`${game.Gmdt.replace(datePattern, '$1-$2-$3')}T${game.Gmtm}Z`);
    }

    // homeTeam.longName - homeTeam.shortName
    if (isExists(game.Htm)) {
        const homeTeamNameParts = game.Htm.split(' ');
        renderedGame.homeTeam.longName = homeTeamNameParts[0];
        if (isExists(homeTeamNameParts[1]))
            renderedGame.homeTeam.shortName = homeTeamNameParts[1].replace('(', '').replace(')', '');
    }

    // homeTeam.rotationNumber
    if (isExists(game.Hnum)) {
        renderedGame.homeTeam.rotationNumber = game.Hnum;
    }

    // awayTeam.longName - awayTeam.shortName
    if (isExists(game.Vtm)) {
        const awayTeamNameParts = game.Vtm.split(' ');
        renderedGame.awayTeam.longName = awayTeamNameParts[0];
        if (isExists(awayTeamNameParts[1]))
            renderedGame.awayTeam.shortName = awayTeamNameParts[1].replace('(', '').replace(')', '');
    }

    // awayTeam.rotationNumber
    if (isExists(game.Vnum)) {
        renderedGame.awayTeam.rotationNumber = game.Vnum;
    }

    if (isExists(game.Lines) && isExists(game.Lines[0])) {
        // homeMoneylinePrice
        if (isExists(game.Lines[0].Hoddst)) {
            renderedGame.homeMoneylinePrice = Number(game.Lines[0].Hoddst);
        }

        // awayMoneylinePrice
        if (isExists(game.Lines[0].Voddst)) {
            renderedGame.awayMoneylinePrice = Number(game.Lines[0].Voddst);
        }

        // homeTeamSpread
        if (isExists(game.Lines[0].Hsprdt)) {
            renderedGame.homeTeamSpread = Number(game.Lines[0].Hsprdt);
        }

        // awayTeamSpread
        if (isExists(game.Lines[0].Vsprdt)) {
            renderedGame.awayTeamSpread = Number(game.Lines[0].Vsprdt);
        }

        // homeSpreadPrice
        if (isExists(game.Lines[0].Hsprdoddst)) {
            renderedGame.homeSpreadPrice = Number(game.Lines[0].Hsprdoddst);
        }

        // awaySpreadPrice
        if (isExists(game.Lines[0].Vsprdoddst)) {
            renderedGame.awaySpreadPrice = Number(game.Lines[0].Vsprdoddst);
        }

        // total
        if (isExists(game.Lines[0].Unt)) {
            renderedGame.total = Number(game.Lines[0].Unt);
        }

        // overPrice
        if (isExists(game.Lines[0].Ovoddst)) {
            renderedGame.overPrice = Number(game.Lines[0].Ovoddst);
        }

        // underPrice
        if (isExists(game.Lines[0].Unoddst)) {
            renderedGame.underPrice = Number(game.Lines[0].Unoddst);
        }
    }

    if (game.GamesChilds && game.GamesChilds.length > 0) {
        const firstPeriodGame = game.GamesChilds.find((childGame) => childGame.Idgmtyp === 104);

        if (firstPeriodGame && firstPeriodGame.Lines && firstPeriodGame.Lines[0]) {
            // firstPeriodHomeMoneylinePrice
            if (isExists(firstPeriodGame.Lines[0].Hoddst)) {
                renderedGame.firstPeriodHomeMoneylinePrice = Number(firstPeriodGame.Lines[0].Hoddst);
            }

            // firstPeriodAwayMoneylinePrice
            if (isExists(firstPeriodGame.Lines[0].Voddst)) {
                renderedGame.firstPeriodAwayMoneylinePrice = Number(firstPeriodGame.Lines[0].Voddst);
            }
        }
    }

    // offTheBoard: Boolean => returns true only if the game has none of the below odds
    if (
        !isExists(renderedGame.homeMoneylinePrice) &&
        !isExists(renderedGame.awayMoneylinePrice) &&
        !isExists(renderedGame.homeTeamSpread) &&
        !isExists(renderedGame.awayTeamSpread) &&
        !isExists(renderedGame.homeSpreadPrice) &&
        !isExists(renderedGame.awaySpreadPrice) &&
        !isExists(renderedGame.total) &&
        !isExists(renderedGame.overPrice) &&
        !isExists(renderedGame.underPrice) &&
        !isExists(renderedGame.firstPeriodHomeMoneylinePrice) &&
        !isExists(renderedGame.firstPeriodAwayMoneylinePrice)
    ) {
        renderedGame.offTheBoard = true;
    }

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
    console.log('parsedGames', parsedGames);

    // also let's sort these games in 2 different ways

    // How likely the favorite is to win
    // First, determine who the favorite is - this is whoever's moneyline odds are most negative
    // A team with moneyline odds -140 is favored over a team with moneyline odds +125
    // Then, sort so that the game with the biggest favorite comes first
    // And the game with the smallest favorite comes last (Rangers -120 @ Devils +100)
    // console.log(gamesSortedByFavoritePrice);
    const gamesSortedByFavoritePrice = sortByFavoritePrice(parsedGames);

    // Second, sort the games from highest total to lowest total
    // If a game has a total of 6.5, it should come before a game with a total of 5.5
    // If 2 games have the same total, they should be sorted by overPrice in ascending order
    // ex: O 6.5 -115 comes before O 6.5 -105
    // console.log(gamesSortedByTotal)
    const gamesSortedByTotal = sortByTotal(parsedGames);

    // Now pass off each of these arrays to a "worker"
    // and map every game to the makeGameDecimal function
    // the worker should throw and catch an exception
    // if any of the "price" fields of the game - homeMoneylinePrice, awayMoneylinePrice, etc.
    // are null

    const test_emitter = require('./worker');

    test_emitter.on('decimalGames', ({ type, decimalGames }) => {
        console.error('[decimalGames]', type, decimalGames);
    });

    test_emitter.on('error', (err) => {
        console.error('[test_emitter] Error:', err.message);
    });

    test_emitter.emit('event', { type: 'gamesSortedByFavoritePrice', games: gamesSortedByFavoritePrice });

    test_emitter.emit('event', { type: 'gamesSortedByTotal', games: gamesSortedByTotal });

    // console.log(test_emitter);
})();
