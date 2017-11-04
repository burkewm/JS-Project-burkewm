/////////////////////////////////////////////////////////////
//
// Dependencies
//

var express = require('express');
var fs = require("fs");

/////////////////////////////////////////////////////////////
//
// Server Setup
//

// set up server (app) host and port
var app = express();
var server = app.listen(8080);

// serve static files from the public directory
app.use(express.static(__dirname + "/public"));


/////////////////////////////////////////////////////////////
//
// Initialization
//
var cuisines  = [];
var restaurants = [];

// ** CREATE VARIABLES TO HOLD CUISINE AND RESTAURANT ARRAYS HERE **

// this is an Immediately-Invoked Function Expression (IIFE)
// it is used to initialize the server by loading restaurant
// data into memory

//IIFE
(function () {
        cuisines = getRestaurantData("cuisines");
        cuisines.forEach(function(cuisine) {

        var val = getRestaurantData(cuisine);
            for( var i = 0; i < val.length; i++ ) {
                val[i].cuisine = cuisine;
            }
            Array.prototype.push.apply(restaurants,val);
        });
    })();
// ** INSERT IMMEDIATELY-INVOCED FUNCTION EXPRESSION HERE **

// load data from files and convert to JSON
function getRestaurantData(filename) {
    var data = fs.readFileSync(__dirname + "/data/" + filename + ".json", 'utf8');
    return JSON.parse(data);
}



/////////////////////////////////////////////////////////////
//
// RESTful services
//

// get all cuisines
app.get('/cuisines', function(req, res){

    res.end(JSON.stringify(cuisines));

});

// get all restaurants
app.get('/restaurants', function (req, res){
    res.end(JSON.stringify(restaurants));
    // ** RETURN ALL RESTAURANTS MATCING THE CUISINE TYPE HERE **

});

// get restaurants by cuisine
app.get('/restaurants/:cuisine', function (req, res){
    
        var cuisine = req.params.cuisine;
    
        var restaurantsToReturn = [];
    
        restaurants.forEach(function(restaurant) {
          if( restaurant.cuisine == cuisine ) {
              restaurantsToReturn.push(restaurant);
          }
        });
    
        res.end(JSON.stringify(restaurantsToReturn));
    
    });