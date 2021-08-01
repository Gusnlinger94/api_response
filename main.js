const fs = require('fs');
const { isUndefined } = require('util');

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

function isDefinedNumber(attributeValue){
    return typeof attributeValue === 'undefined' || attributeValue === null || attributeValue === "" ? null : Number(attributeValue);
}

function isDefinedBolean(attributeValue){
    return typeof attributeValue === 'undefined' || attributeValue === null || attributeValue === "" ? false : true;
}

function checkOffTheBoard(game){

}

function renderGame(game) {
    // should return a game object defined by the above schema
    // if a field is not available it should be null
    const renderedGame = {};
    //renderedGame.homeMoneylinePrice = game.Lines[0].Hoddst || null;
    
    
    renderedGame.startTime = new Date(`${game.Gmdt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}T${game.Gmtm}Z`);
    var homeTeamNameSplit = game.Htm.split(" ", 2);
    var visitorTeamNameSplit = game.Vtm.split(" ", 2);
    renderedGame.homeTeam = {
        longName: homeTeamNameSplit[0],
        shortName: homeTeamNameSplit[1].replace(/[()]/g, ''),
        rotationNumber: String(game.Hnum)
    };
    renderedGame.awayTeam = {
        longName: visitorTeamNameSplit[0],
        shortName: visitorTeamNameSplit[1].replace(/[()]/g, ''),
        rotationNumber: String(game.Vnum)
    };
    renderedGame.offTheBoard = false;
    renderedGame.homeMoneylinePrice = isDefinedNumber(game.Lines[0].Hoddst);
    renderedGame.firstPeriodHomeMoneylinePrice = isDefinedNumber(game.GamesChilds[0].Lines[0].Hoddst),
    renderedGame.awayMoneylinePrice = isDefinedNumber(game.Lines[0].Voddst);
    renderedGame.firstPeriodAwayMoneylinePrice = isDefinedNumber(game.GamesChilds[0].Lines[0].Voddst);
    renderedGame.homeTeamSpread = isDefinedNumber(game.Lines[0].Hsprdt);
    renderedGame.awayTeamSpread = isDefinedNumber(game.Lines[0].Vsprdt);
    renderedGame.homeSpreadPrice = isDefinedNumber(game.Lines[0].Hsprdoddst);
    renderedGame.awaySpreadPrice =  isDefinedNumber(game.Lines[0].Vsprdoddst);;
    renderedGame.total = isDefinedNumber(game.Lines[0].Unt);
    renderedGame.overPrice = isDefinedNumber(game.Lines[0].Ovoddst);
    renderedGame.underPrice = isDefinedNumber(game.Lines[0].Unoddst);

    if(
        isDefinedBolean(renderedGame.homeMoneylinePrice) == false &&
        isDefinedBolean(renderedGame.firstPeriodHomeMoneylinePrice) == false &&
        isDefinedBolean(renderedGame.awayMoneylinePrice) == false &&
        isDefinedBolean(renderedGame.firstPeriodAwayMoneylinePrice) == false &&
        isDefinedBolean(renderedGame.homeTeamSpread) == false &&
        isDefinedBolean(renderedGame.awayTeamSpread) == false &&
        isDefinedBolean(renderedGame.homeSpreadPrice)  == false &&
        isDefinedBolean(renderedGame.awaySpreadPrice) == false &&
        isDefinedBolean(renderedGame.total) == false &&
        isDefinedBolean(renderedGame.overPrice) == false && 
        isDefinedBolean(renderedGame.underPrice) == false 
    ){
        renderedGame.offTheBoard = true;
    }

    return renderedGame;
}

 const gamesSortedByFavoritePrice = (games) => {
    return games.sort((a,b)=>{
        var aGameHome = a.homeMoneylinePrice || Number.MAX_SAFE_INTEGER;
        var aGameAway = a.awayMoneylinePrice || Number.MAX_SAFE_INTEGER;
        var aFavorite = aGameHome < aGameAway ? aGameHome : aGameAway;

        var bGameHome = b.homeMoneylinePrice || Number.MAX_SAFE_INTEGER;
        var bGameAway = b.awayMoneylinePrice || Number.MAX_SAFE_INTEGER;
        var bFavorite = bGameHome < bGameAway ? bGameHome : bGameAway;

        return aFavorite - bFavorite;
       
    });
}

const gamesSortedByTotal = (games)=>{
    return games.sort((a,b) => {
        var aTotal = a.total || Number.MAX_SAFE_INTEGER
        var bTotal = b.total || Number.MAX_SAFE_INTEGER

        if(aTotal == bTotal){
            var aOverPrice = a.overPrice || Number.MAX_SAFE_INTEGER
            var bOverPrice = b.overPrice || Number.MAX_SAFE_INTEGER
            return aOverPrice - bOverPrice;
        }else{
            return bTotal - aTotal;
        } 
    });
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
    //console.log(JSON.stringify(parsedGames));
    //console.log("sortedby price line");
    //var sortedArray = quicksortUniversal(parsedGames, 0, parsedGames.length - 1, "mlfasc");
    console.log("\n More Readable Games \n")
    console.log(parsedGames);

    // also let's sort these games in 2 different ways

    // How likely the favorite is to win
    // First, determine who the favorite is - this is whoever's moneyline odds are most negative
    // A team with moneyline odds -140 is favored over a team with moneyline odds +125
    // Then, sort so that the game with the biggest favorite comes first
    // And the game with the smallest favorite comes last (Rangers -120 @ Devils +100)
    var gamesSortedByFavoritePriceDesc = gamesSortedByFavoritePrice(parsedGames);

    console.log("\n Games sorted by favorite priceline \n")
    console.log(gamesSortedByFavoritePriceDesc);


    // Second, sort the games from highest total to lowest total
    // If a game has a total of 6.5, it should come before a game with a total of 5.5
    // If 2 games have the same total, they should be sorted by overPrice in ascending order
    // ex: O 6.5 -115 comes before O 6.5 -105
    var gamesSortedByTotalDesc = gamesSortedByTotal(parsedGames);

    console.log("\n Games sorted by total \n")
    console.log(gamesSortedByTotalDesc);



    // Now pass off each of these arrays to a "worker"
    // and map every game to the makeGameDecimal function
    // the worker should throw and catch an exception
    // if any of the "price" fields of the game - homeMoneylinePrice, awayMoneylinePrice, etc.
    // are null

    const test_emitter = require('./worker');

    test_emitter.emit('event', {type: 'gamesSortedByFavoritePrice' , games: gamesSortedByFavoritePriceDesc });
    test_emitter.emit('event', {type: 'gamesSortedByTotal' , games: gamesSortedByTotalDesc });

    // console.log(test_emitter);

}());
