
var json_responses;
var Client = require('node-rest-client').Client;
var http = require('http');
var count = "";
var endpoint = "https://api.meetup.com/topics?search=tech&key=15257f2bd835555253b477b235278";

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
	console.log(JSON.stringify(output));
	res.render("events", {
		values : output
	})
}