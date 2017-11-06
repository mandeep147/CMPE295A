var json_responses;
var Client = require('node-rest-client').Client;
var http = require('http');

var meetupAPI = "https://api.meetup.com/2/concierge?city=San+Jose%2CSunnyvale%2CSanta+Clara%2CCupertino&key=15257f2bd835555253b477b235278";
var client = new Client();

client.get(meetupAPI, function(data, response_raw) {
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

exports.searchMeetupSFEvents = function(req, res) {
	
	var meupEvents=[];
    var output = [];
 //   var venueoutput = [];
    
    var outputMeetup = [];
    for (i in json_responses.data) {
    	outputMeetup.push(json_responses.data[i]);

    }
    output.push(outputMeetup);

   
    console.log(output[0][0][0].description);
    console.log(output[0][0][0].event_url);
    console.log(output[0][0][0].name);
    console.log(output[0][0][0].id);
    console.log(output[0][0][0].status);
  /*  
    console.log(output[0][0][0].venue);
    venueoutput.push(output[0][0][0].venue);
    console.log(venueoutput[0].country); */
    
    console.log(output[0][0][0].time);
   
   var a = new Date(output[0][0][0].time);
    console.log(a);

   console.log(output[0][0]);  
    
    
    
    var muobj = {"outputMeetup" : outputMeetup};
    var mongo = require("./mongoConnect");
    var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";
    var json_re={user:"kalyani"};
   
    
    res.render("meetupSJ", {
        values : output
    });
    
    for(var i=0;i<output[0][0].length;i++)
    {
    	if(typeof output[0][0][i].venue != 'undefined')
    		{
    	console.log("hiiii in loop"+i);
    	meup={};
    	var venueoutput = [];
    	meup.id=output[0][0][i].id;
    	meup.title=output[0][0][i].name;
    	
    	var a = new Date(output[0][0][i].time);
    	meup.time=a;
    	
    	meup.description=output[0][0][i].description;
    	meup.url=output[0][0][i].event_url;
    	meup.status=output[0][0][i].status;
    	

    	venueoutput.push(output[0][0][i].venue);
    	console.log(venueoutput);
    	console.log(venueoutput[0].country);
    	
    	console.log("hiiii");
    	
    	meup.address=venueoutput[0].address_1;
    	console.log("hiiii" + venueoutput[0].address_1);
    	meup.city=venueoutput[0].city;
    	meup.state=venueoutput[0].state;
        meup.country=venueoutput[0].localized_country_name;
        
        meup.type="SFTECH";
    	
    	
    	meupEvents.push(meup);
    	
    }
    
    
    	
    }
    var eventobjnew = {"meupEvents" : meupEvents};
    
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll1 = mongo.collection('meetup');
		
		coll1.insert(eventobjnew,(function(err, user){
			if (!err) {
							
				console.log("Details saved successfully  ");

			} else {
				console.log("returned false"+err);
			}
		}));
		
	});
	

	

};


