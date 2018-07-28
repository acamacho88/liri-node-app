var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');

require("dotenv").config();
var keys = require('./keys');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var omdbFunc = function (movieName) {
    var queryURL = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
        var movieData = JSON.parse(body);
        console.log("Title: " + movieData.Title + "\n" +
            "Year: " + movieData.Year + "\n" +
            "IMDB Rating: " + movieData.imdbRating + "\n" +
            "RT Rating: " + movieData.Ratings[1].Value + "\n" +
            "Production country: " + movieData.Country + "\n" +
            "Language: " + movieData.Language + "\n" +
            "Plot: " + movieData.Plot + "\n" +
            "Actors: " + movieData.Actors + "\n");
    })
}

if (process.argv.length > 2) {
    var funcName = process.argv[2];
    switch (funcName) {
        case 'my-tweets':
            break;
        case 'spotify-this-song':
            var song = '';
            if (process.argv.length > 3) {
                song = process.argv[3];
            } else {
                song = 'The Sign';
            }
            if (process.argv.length > 4) {
                for (var i = 4; i < process.argv.length; i++) {
                    song += ' ' + process.argv[i];
                }
            }
            console.log(song);
            spotify.search({
                type: 'track',
                query: song
            }, function (err, data) {
                if (err) console.log(err);
                var songData = data.tracks.items[0];
                if (song == 'The Sign') songData = data.tracks.items[5];
                console.log('Artist: ' + songData.artists[0].name + '\n' +
                    'Song name: ' + songData.name + '\n' +
                    'Preview url: ' + (songData.preview_url !== null ? songData.preview_url : 'none available') + '\n' +
                    'Album: ' + songData.album.name);
            })
            break;
        case 'movie-this':
            var movieName = '';
            if (process.argv.length > 3) {
                movieName = process.argv[3];
            } else {
                movieName = 'Mr+Nobody';
            }
            if (process.argv.length > 4) {
                for (var i = 4; i < process.argv.length; i++) {
                    movieName += '+' + process.argv[i];
                }
            }
            omdbFunc(movieName);
            break;
        case 'do-what-it-says':
            break;
    }
}