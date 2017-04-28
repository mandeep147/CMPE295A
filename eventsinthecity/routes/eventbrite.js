/**
 * Created by mandeep on 4/26/17.
 */

var json_responses;
var Client = require('node-rest-client').Client;
var http = require('http');

/**
 * token = R3COIUX46H3TNBRBIYVS
 * category 102 = Science and Technology
 * address = San Francisco Bay Area
 */

var eventBriteAPI = "https://www.eventbriteapi.com/v3/events/search/?categories=102&location.address=San Francisco Bay Area&token=R3COIUX46H3TNBRBIYVS";

var eventbriteClient = new Client();

eventbriteClient.get(eventBriteAPI, function(data, response_raw) {
    if (response_raw) {

        if (data) {
            json_responses = {
                "data" : data
            };
        }
    }

    else {
        console.log("returned false");
    }
});

exports.eventBriteEvents = function(req, res) {

    var output = [];

    for (i in json_responses.data) {
        output.push(json_responses.data[i]);
    }
    console.log(output);

    //    console.log(output[1][1]);
  //  console.log(output[1][1].description);
    //console.log(output[1][1].description.text());
    res.render("eventbrite", {
        values : output
    });
};