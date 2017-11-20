var json_responses;

var http = require('http'),
  assert = require('assert');

var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";

var output = [];
var outputFun = [];
var recommend=[];
var recommendFun=[];

//Extract data for TechEvents data
mongo.connect(mongoURL, function(db) {
  console.log('Connected to mongo at: ' + mongoURL);
  var coll1 = db.collection('techEvents');
  coll1.find().toArray(function(err, result) {
    if (result.length) {

      output= output.concat(result[0].ebEventsSF);
      output= output.concat(result[1].ebEventsSJ);
      output= output.concat(result[2].muSFEvents);
      output= output.concat(result[3].muSJEvents);

    } else {
      console.log(err)
    }
  })
  db.close();
});

//Extract data for Fun Events data
mongo.connect(mongoURL, function(db) {

  console.log('Connected to mongo at: ' + mongoURL);
  var coll2 = db.collection('funEvents');
  coll2.find().toArray(function(err, result) {
    if (result.length) {

      outputFun=outputFun.concat(result[0].funeventsSJ);
      outputFun=outputFun.concat(result[1].funeventsSF);

    } else {
      console.log(err)
    }
  })
  db.close();
});

//Tech Events page - techEvents.ejs
exports.listTechEvents = function(req, res) {
    /**
     * getting random 5 records
     */
    /*for(var i = 0; i < 5; i++){
        var randomNumber =  Math.floor(Math.random() * output.length)
        console.log("inside recommendations" + randomNumber)
        console.log(output[randomNumber]);
    }*/
  res.render("techEvents", {
    values: output
  });
};
//Fun Events page - FunEvents.ejs
exports.listFunEvents = function(req, res) {
    /**
     * getting random 5 records
     */
   /** for(var i = 0; i < 5; i++){
        var randomNumber =  Math.floor(Math.random() * outputFun.length)
        console.log("inside recommendations" + randomNumber)
        console.log(outputFun[randomNumber]);
    }**/
  res.render("funEvents", {
    fun:  outputFun
  });
};

//Single Tech Event page - techEventDetails.ejs
exports.listTechEventDetails = function(req, res) {
	if(req.session.email){
		var eventid = req.param("id");
		var eventType = req.param("type");
		var eventCategory = req.param("cat");
		console.log("id= " + eventid,"type="+eventType, "cat"+eventCategory);
		if(eventCategory == 'tech'){
			for( var i=0;i<output.length; i++){
				if(output[i].id == eventid && output[i].type == eventType){
		        //console.log(req.session.email)
					event={};
					event.userid = req.session.email;
					event.id=eventid;
					event.type=eventType;
					event.category=eventCategory;

		          	mongo.connect(mongoURL, function(){
		          		console.log('Connected to mongo at: ' + mongoURL);
		              	var coll1 = mongo.collection('userevents');

		              	coll1.update({
                          id: event.id},
					  	  {$set:{'userid': event.userid, 'type': event.type, 'category': event.category}},
						  {upsert: true}
                      );
		              /*coll1.insert(event,(function(err, user){
		                  if (!err) {
		                      console.log("Details saved successfully  ");
		                  } else {
		                      console.log("returned false"+err);
		                  }
		              }));*/

		          });

                    for(var i = 0; i < 3; i++) {
                        var randomNumber = Math.floor(Math.random() * output.length)
                        console.log("inside recommendations" + randomNumber)
                        recommend[i]=output[randomNumber];
                    }

                    console.log(recommend)
		        // push data into userevents collection
		        res.render("techEventDetails",{
		          values:output[i], recommend: recommend,
		        })
		      }
		    }
		  }
	}
	else{
		res.render('signin', {title: 'Events in the City'});
	}

};

//Single Fun Event page - funEventDetails.ejs
exports.listFunEventDetails = function(req, res) {
	if(req.session.email){
		  var eventid = req.param("id");
		  var eventType = req.param("type");
		  console.log("id= " + eventid,"type="+eventType);
		  if (eventType == 'fun'){
		    for( var i=0;i<outputFun.length; i++){
		      if(outputFun[i].id == eventid){
		    	  event={};
		          event.userid = req.session.email;
		          event.id=eventid;
		          event.type=eventType;
		          event.category=eventCategory;

		          mongo.connect(mongoURL, function(){
		              console.log('Connected to mongo at: ' + mongoURL);
		              var coll1 = mongo.collection('userevents');

		              coll1.insert(event,(function(err, user){
		                  if (!err) {
		                      console.log("Details saved successfully  ");
		                  } else {
		                      console.log("returned false"+err);
		                  }
		              }));

		          });

                  for(var i = 0; i < 3; i++){
                      var randomNumber =  Math.floor(Math.random() * outputFun.length)
                      console.log("inside recommendations" + randomNumber)
                      recommendFun[i]=outputFun[randomNumber];
                  }

		          // push data into userevents collection
		        res.render("funEventDetails",{
		          fun:outputFun[i], recommend: recommendFun,
		        });
		      }
		    }
		  }
	}
	else{
		res.render('signin', {title: 'Events in the City'});
	}

};


exports.savetechDetails = function(req, res){
	
	var eventid = req.body.eventid;
	var type = req.body.eventType;
	
	console.log("fav eventid "+eventid);
	console.log("fav event type "+type);

//	res.redirect('/techEvents');

	var techfvrt = {
			userid : req.session.email,
			eventid : req.body.eventid,
			type : req.body.eventType,
			category : "tech",
		};
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('favoriteEvents');

		coll.insert(techfvrt,(function(err, user){
			if (user) {
							
				console.log("Details saved successfully  ");

			} else {
				console.log("returned false");
			}
		}));
	});  
	res.redirect('/techEventDetails?id='+eventid+'&type='+type+'&cat=tech');
	};
	
	
	exports.savefunDetails = function(req, res){
		
		var funeventid = req.body.eventid;
		var funtype = req.body.eventType;
		
		console.log("fav fun eventid "+funeventid);
		console.log("fav fun event type "+funtype);

//		res.redirect('/techEvents');

		var funfvrt = {
				userid : req.session.email,
				eventid : req.body.eventid,
				type : req.body.eventType,
				category : "fun",
			};
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('favoriteEvents');

			coll.insert(funfvrt,(function(err, user){
				if (user) {
								
					console.log("Details saved successfully  ");

				} else {
					console.log("returned false");
				}
			}));
		});  
		res.redirect('/funEventDetails?id='+eventid+'&type='+type+'&cat=fun');
		};