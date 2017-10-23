var json_responses;
var Client = require('node-rest-client').Client;
var http = require('http');

var eventBriteAPI = "https://www.eventbriteapi.com/v3/events/search/?categories=102&location.address=San Francisco Bay Area&token=R3COIUX46H3TNBRBIYVS";
var meetupEndpoint = "https://api.meetup.com/topics?search=tech&key=15257f2bd835555253b477b235278";
var meetupEndpoint1 = "https://api.meetup.com/topics?search=tech&key=1a9e6c7667695a491e1c255a63f72";
var client = new Client();

client.get(eventBriteAPI, function(data, response_raw) {
    if (response_raw) {
    	if (data) {
            json_responses = {
                "data" : data
            };
            // Call meetup API 
            var clientMeetup = new Client();
            clientMeetup.get(meetupEndpoint, function(data1, response_raw1) {
            	if (response_raw1) {
            			if (data1) {
            			json_responses1 = {
            				"data" : data1
            			};
            		}
            	}

            	else {
            		console.log("returned false");
            	}
            });
           
        }
    }
    else {
        console.log("returned false");
    }
});

exports.searchEvents = function(req, res) {

    var output = [];
    var outputEventBrite = [];
    var outputMeetup = [];
    for (i in json_responses.data) {
    	outputEventBrite.push(json_responses.data[i]);
    }
    for (i in json_responses1.data) {
    	outputMeetup.push(json_responses1.data[i]);
    }
    output.push(outputEventBrite);
    output.push(outputMeetup);
    console.log(JSON.stringify(output));
   var ebobj = {"outputEventBrite" : outputEventBrite};
    /*
    ebobj = {"id":outputEventBrite.id,
    		"desc":outputEventBrite.description,
    		"name":outputEventBrite.name,
    		"url":outputEventBrite.url};
    
    ebobj.id=outputEventBrite.id;
    ebobj.desc=outputEventBrite.description;
    ebobj.name=outputEventBrite.name;
    ebobj.url=outputEventBrite.url;
    */
    var muobj = {"outputMeetup" : outputMeetup};
    var mongo = require("./mongoConnect");
    var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";
    var json_re={user:"kalyani"};
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll1 = mongo.collection('ebapi');
		var coll2 = mongo.collection('muapi');

		coll1.insert(ebobj,(function(err, user){
			if (!err) {
							
				console.log("Details saved successfully  ");

			} else {
				console.log("returned false"+err);
			}
		}));
		
		coll2.insert(muobj,(function(err, user){
			if (!err) {
							
				console.log("Details saved successfully  ");

			} else {
				console.log("returned false");
			}
		}));
	});
    
    
    res.render("events", {
        values : output
    });
};




exports.meetupDetailsget = function(req, res) {
	var clientMeetup1 = new Client();
	var eventid = req.param("id");
	console.log("idMeetup= "+eventid)
	clientMeetup1.get(meetupEndpoint1, function(data2, response_raw2) {
		if (response_raw2) {
			//console.log("Client Meetup 1 working")
			if (data2) {
				json_responses2 = {
					"data" : data2
				};
				console.log("Data Results"+json_responses2.data.results[0])
				for(var i=0;i<json_responses2.data.results[0].length; i++){
					console.log("Responses"+json_responses2.data.results[0][i].id)
					if(json_responses2.data.results[0][i].id==eventid)
					{
						console.log("hey");
						res.render("nextpage1",{
							values : json_responses2.data.results[0][i]
						})
					}
					else{
						res.send("Not Found");
					}
				}
			}
		}

		else {
			res.send("Not Found");
			console.log("returned false");
		}
	});	
	
		
		


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

