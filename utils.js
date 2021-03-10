module.exports = {
    isExists: (value) => typeof value !== 'undefined' && !!value,

    sortByFavoritePrice: (games) => {
        return games.slice().sort((g1, g2) => {
            const g1HomeMoneylinePrice = g1.homeMoneylinePrice || Number.MAX_SAFE_INTEGER;
            const g1AwayMoneylinePrice = g1.awayMoneylinePrice || Number.MAX_SAFE_INTEGER;
            const g1FavoriteTeamMoneylinePrice = Math.min(g1HomeMoneylinePrice, g1AwayMoneylinePrice);

            const g2HomeMoneylinePrice = g2.homeMoneylinePrice || Number.MAX_SAFE_INTEGER;
            const g2AwayMoneylinePrice = g2.awayMoneylinePrice || Number.MAX_SAFE_INTEGER;
            const g2FavoriteTeamMoneylinePrice = Math.min(g2HomeMoneylinePrice, g2AwayMoneylinePrice);

            return g1FavoriteTeamMoneylinePrice - g2FavoriteTeamMoneylinePrice;
        });
    },

    sortByTotal: (games) => {
        return games.slice().sort((g1, g2) => {
            const g1Total = g1.total || Number.MAX_SAFE_INTEGER;
            const g2Total = g2.total || Number.MAX_SAFE_INTEGER;

            const g1OverPrice = g1.overPrice || -1;
            const g2OverPrice = g2.overPrice || -1;

            return g2Total - g1Total || g1OverPrice - g2OverPrice;
        });
    },
};
