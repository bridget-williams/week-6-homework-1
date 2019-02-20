// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


//-------------------------------------------------------------//
//----------------------- AUTHORIZATION -----------------------//
//-------------------------------------------------------------//


// Initialize Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// The object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

// Using the Client Credentials auth flow, authenticate our app
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
  
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('Got an access token: ' + spotifyApi.getAccessToken());
  
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });


//-------------------------------------------------------------//
//------------------------- API CALLS -------------------------//
//-------------------------------------------------------------//


app.get('/search-track', function (request, response) {
  
  // Search for a track!
  spotifyApi.searchTracks('track:proud of u', {limit: 1})
    .then(function(data) {
    
      // Send the first (only) track object
      response.send(data.body.tracks.items[0]);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/category-playlists', function (request, response) {
  
  // Make an initial list of countries
  let countries = [
    {
      name: "Sweden",
      code: "SE"
    },
    {
      name: "France",
      code: "FR"
    },
  ];
  
  
  // Get the playlists for the given category for each country
  countries.forEach((c) => {
    spotifyApi.getPlaylistsForCategory(
      'jazz', 
      { country: c.code, limit : 10 }
    )
      .then((data) => {
        // Persist the data on this country object
        c.data = data.body;
    }, function(err) {
      console.error(err);
    });
  });
  
  // Check will see if we have .data on all the country objects
  // which indicates all requests have returned successfully.
  // If the lengths don't match then we call check again in 500ms
  let check = () => {
    if (countries.filter(c => c.data !== undefined).length 
    !== countries.length) {
      setTimeout(check, 500);
    } else {
      response.send(countries);
    }
  }
  
  // Call check so we don't send a response until we have all the data back
  check();
});

app.get('/audio-features', function (request, response) {
  
  // Get the audio features for a track ID
  spotifyApi.getAudioFeaturesForTrack('4uLU6hMCjMI75M1A2tKUQC')
    .then(function(data) {
    
      //Send the audio features object
      response.send(data.body);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/artist', function (request, response) {
  
  // Get information about an artist
  spotifyApi.getArtist('34482S5nfxR441wcnVfrHi')
    .then(function(data) {
    
      // Send the list of tracks
      response.send(data.body);
    
    }, function(err) {
      console.error(err);
    });
});

app.get('/artist-top-tracks', function (request, response) {
  
  // Make an initial list of artists
  let artists = [
    {
      name: "Taylor Swift",
      code: "06HL4z0CvFAxyc27GXpf02"
    },
    {
      name: "Ariana Grande",
      code: "66CXWjxzNUsdJxJ2JdwvnR"
    },
  ];
  
  
  
  // Get the artists top tracks for each country
  artists.forEach((a) => {
    spotifyApi.getArtistTopTracks(a.code, 'US')
      .then((data) => {
        // Persist the data on this artist object
        a.data = data.body;
    }, function(err) {
      console.error(err);
    });
  });
  
  let check = () => {
    if (artists.filter(a => a.data !== undefined).length 
    !== artists.length) {
      setTimeout(check, 500);
    } else {
      response.send(artists);
    }
  }
  
  // Call check
  check();

});


//-------------------------------------------------------------//
//------------------------ WEB SERVER -------------------------//
//-------------------------------------------------------------//


// Listen for requests to our app
// We make these requests from client.js
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
