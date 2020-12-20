/*******************************************
 * Alipine js
 *******************************************/

// Search api call timout
let searchTimeout;

// List of slugs of games to display in top games section
let topGamesList = [
    'dota-2',
    'counter-strike-global-offensive',
    'sniper-ghost-warrior-3',
];

function data(){

    return {
        isPageLoading: true,
        isResultsOpen: false,
        isSearchLoading: false,
        results: [],
        topGames: [],

        // On page load
        onPageLoad(){
            this.loadTopGames();
        },

        // Determine if result list should display or not
        showResults(explicit) {
            if(explicit == false){
                return false;
            }

            return this.results && this.results.length > 0;
        },

        // Load top games list
        loadTopGames() {
            Promise.all(
                topGamesList.map(slug => {
                    return getGameDetails(slug);
                }),
            ).then(results => {
                results.map(result => {
                    this.topGames.push(result);
                });

                this.isPageLoading = false;
                
                setTimeout(() => {
                    $('.top-games .ratings').starRating({ starSize: 18, })
                }, 0);
            });
        },

        // Serach games
        search(e) {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                this.isSearchLoading = true;

                preformSearch(e.target.value)
                    .then(searchResults => {
                        this.isSearchLoading = false;
                        
                        this.results = searchResults;
                    });
            }, 750);

        },

        // When search result clicked
        resultClicked(slug) {
            window.location.href = '/game-details.html?slug=' + slug;
        },
    }

}