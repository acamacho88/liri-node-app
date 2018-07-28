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