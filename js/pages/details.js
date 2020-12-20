/*******************************************
 * Alipine js
 *******************************************/

function data(){
    return {
        isPageLoading: true,
        game: {
            name: null,
            slug: null,
            description_raw: null,
            platforms: null,
            platform_list: [],
            rating: null,
            rating_top: null,
            trailer: {
                preview: null,
                url: null
            }
        },
        isScreenshotsLoading: false,
        screenshots: [],

        onPageLoad() {
            this.loadGameDetails();

            const player = new Plyr('#trailer-player', {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
            });
        },

        loadGameDetails() {
            let url = new URL(window.location.href);

            let gameSlug = url.searchParams.get('slug');

            if( ! gameSlug){
                window.location.href = '/404.html';
            }

            getGameDetails(gameSlug)
                .then(game => {

                    console.log('asd');

                    // Load game trailer
                    getGameTrailer(game.id).then(trailer => {
                        game['trailer'] = trailer;

                        // If trailer not found, we use gameplay
                        if(!trailer && game.clip){
                            game['trailer'] = {
                                preview: game.clip.preview,
                                url: game.clip.clips.full,
                            }
                        }

                        this.game = game;
                        this.isPageLoading = false;

                        setTimeout(() => {
                            $('#game-rating').starRating({ starSize: 18, })
                        }, 0);
                    });

                    // Load screenshots
                    this.isScreenshotsLoading = true;
                    getGameScreenshots(game.id).then(screenshots => {
                        this.screenshots = screenshots;

                        this.isScreenshotsLoading = false;
                    });
                })

        }
    }
}