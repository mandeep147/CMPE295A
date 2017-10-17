
json_responses = {};
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
	console.log(JSON.stringify(output));
	res.render("events", {
		values : output
	})
}

exports.eventDetailsget = function(req, res) {
var eventid = req.param("id");
	console.log("id= "+eventid)
	for(var i=0;i<json_responses.data.events.length; i++){
		console.log("Responses"+json_responses.data.events[i].id)
		if(json_responses.data.events[i].id==eventid)
		{
			res.render("nextpage",{
				values : json_responses.data.events[i]
			})
		}
	}


}
exports.nextpage = function(req, res) {
	console.log("In function");
	id= req.param("id");
	console.log(id);
}