
var json_responses;
var Client = require('node-rest-client').Client;
var http = require('http');
var endpoint = "https://www.eventbriteapi.com/v3/events/search/?categories=102&location.address=San Francisco Bay Area&token=R3COIUX46H3TNBRBIYVS";


var client = new Client();
client.get(endpoint, function(data, response_raw) {
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


exports.searchEvents = function(req, res) {
	var output = [];

	for (i in json_responses.data) {
			output.push(json_responses.data[i]);
	}
	//console.log(JSON.stringify(output));
	res.render("events", {
		values : output
	})
}
