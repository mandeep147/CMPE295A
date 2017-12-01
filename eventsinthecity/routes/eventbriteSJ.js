var json_responses;
var Client = require('node-rest-client').Client;
var http = require('http');

var eventBriteAPI = "https://www.eventbriteapi.com/v3/events/search/?categories=102&location.address=San Jose&token=R3COIUX46H3TNBRBIYVS";

var client = new Client();

client.get(eventBriteAPI, function(data, response_raw) {
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

exports.searchEbSJEvents = function(req, res) {
	
	var ebEvents=[];
    var output = [];
    var outputEventBrite = [];

    for (i in json_responses.data) {
    	outputEventBrite.push(json_responses.data[i]);
    }

    output.push(outputEventBrite);
    
    var mongo = require("./mongoConnect");
    var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";
    var json_re={user:"kalyani"};
   
 //   console.log(output[0][1]);
    
    res.render("eventbritesj", {
        values : output
    });
    
   
    for(var i=0;i<output[0][1].length;i++)
    {
    //	console.log(output[0][1][i].name.text);
    //	console.log(output[0][1][i].description.text);
    	if (output[0][1][i].logo != null)
		{
    	eb={};
    	eb.id=10000 + i;
    	eb.title=output[0][1][i].name.text;
    	var a = new Date(output[0][1][0].start.local);
    	eb.time=a;
    	eb.description=output[0][1][i].description.text;
    	eb.url=output[0][1][i].url;
    	eb.status=output[0][1][i].status;
    	eb.location="San Jose";
    	eb.capacity=output[0][1][i].capacity;
    	eb.type="SJTECH";
    	eb.image=output[0][1][i].logo.url;
    	//console.log(output[0][1][i].logo.url);

    	ebEvents.push(eb);
		}
    	
    }
    var eventobj = {"ebEventsSJ" : ebEvents};
    
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll1 = mongo.collection('techEvents');
		var coll2 = mongo.collection('techfunEvents');
		
		coll1.insert(eventobj,(function(err, user){
			if (!err) {
							
				console.log("Details saved successfully  ");

			} else {
				console.log("returned false"+err);
			}
		}));
		coll2.insert(eventobj,(function(err, user){
			if (!err) {
							
				console.log("Details saved successfully  ");

			} else {
				console.log("returned false"+err);
			}
		}));
		
	});
	

};







