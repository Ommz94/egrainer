// Global variables
let apiBase = 'https://api.rawg.io/api';
let apiKey = '9f658922bf5b4a32b6fa6978e8da1fa9';

let platformIcons = {
    'linux': 'fab fa-linux',
    'macos': 'fab fa-apple',
    'pc': 'fab fa-windows',
    'xbox360': 'fab fa-xbox',
    'xbox-one': 'fab fa-xbox',
    'xbox-series-x': 'fab fa-xbox',
    'playstation5': 'fab fa-playstation',
    'playstation4': 'fab fa-playstation',
    'playstation3': 'fab fa-playstation',
    'ios': 'fab fa-apple',
    'android': 'fab fa-android',
};

// Used with igdb
function authenticate() {
    return axios({
        method: 'post',
        url: 'https://id.twitch.tv/oauth2/token?client_id=vdvgi55nt4dhnrlh22dzncg7vly5wp&client_secret=qqq87lwb987ahumt0nduaejurpd4y0&grant_type=client_credentials',
        headers: {}
    })
        .then(function (response) {
            if(response.data.access_token){
                window.authToken = response.data.access_token;
            }
        })
        .catch(function (error) {
        });
}

// Search games
let cancelToken;
function preformSearch(query){

    if (typeof cancelToken != typeof undefined) {
        cancelToken.cancel();
    }

    //Save the cancel token for the current request
    cancelToken = axios.CancelToken.source();

    var config = {
        method: 'get',
        url: apiBase + '/games',
        cancelToken: cancelToken.token,
        params : {
            'key': apiKey,
            'search': query,
            'page_size': 10,
        }
    };
    
    return axios(config)
        .then(function (response) {

            return response.data.results.map(function(result){
                    if(result.platforms) {
                        result['platforms'] = result.platforms.map(function (platform) {
                            return platform.platform.name;
                        }).join(', ');
                    }
            
                    return result;
                })
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Get single game details by slug
function getGameDetails(slug){
    var config = {
        method: 'get',
        url: apiBase + '/games/' + slug,
        params : {
            'key': apiKey,
            'page_size': 1,
        }
    };

    return axios(config).then(response => {
        let game = response.data;     

        game['platform_list'] = game.platforms;

        game['platforms'] = game.platforms.map(function (platform) {
            return platform.platform.name;
        }).join(', ');

        return game;
    });
}

// Get game trailer
function getGameTrailer(id){
    var config = {
        method: 'get',
        url: apiBase + '/games/' + id + '/movies',
        params : {
            'key': apiKey,
            'page_size': 1,
        }
    };

    return axios(config).then(response => {
        let trailer = response.data.results[0];     

        if(!trailer){
            return null;
        }

        return {
            preview: trailer.preview,
            url: trailer.data.max
        };
    });
}

// Get game screensots
function getGameScreenshots(gameId){
    var config = {
        method: 'get',
        url: apiBase + '/games/' + gameId + '/screenshots',
        params : {
            'key': apiKey,
            'page_size': 12,
        }
    };

    return axios(config).then(response => {
       return response.data.results;
    });
}


function throttle(f, delay){
    var timer = null;
    return function(){
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = window.setTimeout(function(){
            f.apply(context, args);
        },
        delay || 500);
    };
}