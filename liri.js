var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');

require("dotenv").config();
var keys = require('./keys');

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var logData = function (data) {
    fs.appendFile('log.txt', data, function (error) {
        if (error) console.log(error);
    })
}

var twitterFunc = function () {
    var params = {
        screen_name: "notarus57765570"
    };
    twitter.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) console.log(error);
        var nTweets = tweets.length < 20 ? tweets.length : 20;
        var output = '';
        for (var i = 0; i < nTweets; i++) {
            output += "Tweet: " + tweets[i].text + ", Created: " + tweets[i].created_at + "\n";
        }
        console.log(output);
        logData(output);
    })
}

var omdbFunc = function (movieName) {
    var queryURL = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=trilogy";
    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
        var movieData = JSON.parse(body);
        var output = "Title: " + movieData.Title + "\n" +
            "Year: " + movieData.Year + "\n" +
            "IMDB Rating: " + movieData.imdbRating + "\n" +
            "RT Rating: " + movieData.Ratings[1].Value + "\n" +
            "Production country: " + movieData.Country + "\n" +
            "Language: " + movieData.Language + "\n" +
            "Plot: " + movieData.Plot + "\n" +
            "Actors: " + movieData.Actors + "\n";
        console.log(output);
        logData(output);
    })
}

var spotifyFunc = function (song) {
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) console.log(err);
        var songData = data.tracks.items[0];
        if (song == 'The Sign') songData = data.tracks.items[5];
        var output = 'Artist: ' + songData.artists[0].name + '\n' +
            'Song name: ' + songData.name + '\n' +
            'Preview url: ' + (songData.preview_url !== null ? songData.preview_url : 'none available') + '\n' +
            'Album: ' + songData.album.name;
        console.log(output);
        logData(output);
    })
}

var randomFunc = function () {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) console.log(err);
        var args = data.split(',');

        main(args);
    })
}

var main = function (args) {
    var funcName = args[0];
    switch (funcName) {
        case 'my-tweets':
            twitterFunc();
            break;
        case 'spotify-this-song':
            var song = '';
            if (args.length > 1) {
                song = args[1];
            } else {
                song = 'The Sign';
            }
            spotifyFunc(song);
            break;
        case 'movie-this':
            var movieName = '';
            if (args.length > 1) {
                movieName = args[1];
            } else {
                movieName = 'Mr+Nobody';
            }
            omdbFunc(movieName);
            break;
        case 'do-what-it-says':
            randomFunc();
            break;
    }
}

if (process.argv.length > 2) {
    logData("node liri " + process.argv.slice(2).join(' '));
    main(process.argv.slice(2));
}