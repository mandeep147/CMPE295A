var json_responses;

var http = require('http'),
  assert = require('assert');

var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";

var output = [];
var outputFun = [];

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
    for(var i = 0; i < 5; i++){
        var randomNumber =  Math.floor(Math.random() * outputFun.length)
        console.log("inside recommendations" + randomNumber)
        console.log(outputFun[randomNumber]);
    }
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

		              coll1.insert(event,(function(err, user){
		                  if (!err) {
		                      console.log("Details saved successfully  ");
		                  } else {
		                      console.log("returned false"+err);
		                  }
		              }));

		          });

		        // push data into userevents collection
		        res.render("techEventDetails",{
		          values:output[i]
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

		          // push data into userevents collection
		        res.render("funEventDetails",{
		          fun:outputFun[i]
		        });
		      }
		    }
		  }
	}
	else{
		res.render('signin', {title: 'Events in the City'});
	}

};
