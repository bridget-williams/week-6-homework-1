// client-side js
// run by the browser each time your view template is loaded

 document.addEventListener("DOMContentLoaded", function(){
    
  fetch('/search-track').then(resp => resp.json()).then((data) => {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /search-track', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the track name
    // var trackName = $(
    //   // '<h3><a href="' + data.external_urls.spotify + '" target="blank">' + data.name + '</a></h3>'
    //   `<h3><a href="${data.external_urls.spotify}">${data.name}</a></h3>`  
    // );
    // trackName.appendTo('#search-track-container');
    
    let h3 = document.createElement('h3');
    let link = document.createElement('a');
    link.innerText = data.name;
    link.setAttribute('href', data.external_urls.spotify);
    h3.append(link);
    document.getElementById('search-track-container').append(h3);
    
    // Display the artist name
    var artists = '';
    
    data.artists.forEach(function(item) {
      artists = artists + item.name + ' ';
    });
    
    let h5 = document.createElement('h5');
    h5.innerText = artists;
    document.getElementById('search-track-container').append(h5);
    
    // Display the album art
    let img = document.createElement('img');
    img.setAttribute('src', data.album.images[0].url);
    document.getElementById('search-track-container').append(img);
  });
  
  fetch('/category-playlists').then(resp => resp.json()).then((data) => {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /category-playlists', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the covers of the playlists
    data
      .forEach((c) => {
      let h1 = document.createElement('h1');
      h1.innerHTML = '<br><h1>'+ c.name + '</h1><br>';
      document.getElementById('category-playlists-container').append(h1);
      c.data.playlists.items.map(function(playlist, i) {
        let img = document.createElement('img');
        img.setAttribute('class','cover-image');
        img.setAttribute('src', playlist.images[0].url);
        document.getElementById('category-playlists-container').append(img);
      });
    })
  });
  
   
    fetch('/audio-features').then(resp => resp.json()).then((data) => {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /audio-features', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // The audio features we want to show
    var keys = ["danceability", "energy", "acousticness", "speechiness", "loudness"]
    
    // Display the audio features
    keys.map(function(key, i) {
      if (data.hasOwnProperty(key)) {
        let p = document.createElement('p');
        let span = document.createElement('span');
        span.setAttribute('class','big-number');
        span.innerHTML = data[key];
        p.append(span);
        p.innerHTML += key;
        document.getElementById('audio-features-container').append(p);
        //     $('<p><span class="big-number">' + data[key] + ' </span>'  + key + '</p>');
        // feature.appendTo('#audio-features-container');
      }
    });
  });
  
   
  fetch('/artist').then(resp => resp.json()).then((data) => {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /artist', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the artist's image
    let img = document.createElement('img');
    img.setAttribute('class', 'circle-image');
    img.setAttribute('src', data.images[0].url);
    document.getElementById('artist-container').append(img);

    
    // Display the artist name
    let trackName = document.createElement('h3');
     trackName.innerHTML = data.name;
    document.getElementById('artist-container').append(trackName);
    
    // Display the artist's genres
    data.genres.map(function(genre, i) {
      let genreItem = document.createElement('p');
      genreItem.innerHTML =  genre;
      document.getElementById('artist-container').append(genreItem);
    });
    
    //display artists followers and popularity
    let followers = document.createElement('h4');
    followers.innerHTML = 'Followers: ' + data.followers.total;
    document.getElementById('artist-container').append(followers);
    
     let pop = document.createElement('h4');
    pop.innerHTML = 'Popularity: ' + data.popularity;
    document.getElementById('artist-container').append(pop);
  });
  
   fetch('/artist-top-tracks').then(resp => resp.json()).then((data) => {
    // "Data" is the object we get from the API. See server.js for the function that returns it.
    console.group('%cResponse from /artist-top-tracks', 'color: #F037A5; font-size: large');
    console.log(data);
    console.groupEnd();
    
    // Display the audio features
    data.forEach((artist) => {
      let artistName = document.createElement('h3');
      artistName.innerHTML =  artist.name;
      document.getElementById('top-tracks-container').append(artistName);
      artist.data.tracks.forEach((track) =>{
        let trackName = document.createElement('p');
        trackName.innerHTML = track.name;
        document.getElementById('top-tracks-container').append(trackName);
      });
    });
  });

});
