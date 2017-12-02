var json_responses;

var http = require('http'),
  assert = require('assert');

var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";

var output = [];
var goutput = [];
var outputArrays = [];
var outputFun = [];
var goutputFun = [];
var outputFunArrays = [];
var recommend=[];
var recommendFun=[];
var totalStudents = 0;
var totalEvents = 0;
var pageSize = 9;
var tpageCount = 0;
var fpageCount = 0;

//Extract data for TechEvents data
mongo.connect(mongoURL, function(db) {
  //console.log('Connected to mongo at: ' + mongoURL);
  var coll1 = db.collection('techEvents');
  coll1.find().toArray(function(err, result) {
    if (result.length) {

      output= output.concat(result[0].ebEventsSF);
      output= output.concat(result[1].ebEventsSJ);
      output= output.concat(result[2].muSFEvents);
      output= output.concat(result[3].muSJEvents);

      output.sort(function(a, b){return b.capacity - a.capacity});

      goutput= goutput.concat(result[0].ebEventsSF);
      goutput= goutput.concat(result[1].ebEventsSJ);
      goutput= goutput.concat(result[2].muSFEvents);
      goutput= goutput.concat(result[3].muSJEvents);

      totalStudents = output.length;
      pageSize = 9;
      tpageCount = Math.ceil(output.length/9);

      while (output.length > 0) {
    	outputArrays.push(output.splice(0, pageSize));

    	}

    } else {
      console.log(err)
    }
  })
  db.close();
});

//Extract data for Fun Events data
mongo.connect(mongoURL, function(db) {

  //console.log('Connected to mongo at: ' + mongoURL);
  var coll2 = db.collection('funEvents');
  coll2.find().toArray(function(err, result) {
    if (result.length) {

      outputFun=outputFun.concat(result[0].funeventsSJ);
      outputFun=outputFun.concat(result[1].funeventsSF);

      goutputFun=goutputFun.concat(result[0].funeventsSJ);
      goutputFun=goutputFun.concat(result[1].funeventsSF);

      totalEvents = outputFun.length;
      pageSize = 9;
      fpageCount = Math.ceil(outputFun.length/9);

      while (outputFun.length > 0) {
    	  outputFunArrays.push(outputFun.splice(0, pageSize));
    //	console.log("1------"+outputArrays);
    	}

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

	var currentPage = 1;
	//console.log("PageCount is " + tpageCount);
    //console.log("TotalStudents is " + totalStudents);
	if (typeof req.query.page !== 'undefined') {
    	//console.log("2");
        currentPage = +req.query.page;
        //console.log("currentPage is " + currentPage)
    }
	outputList = outputArrays[+currentPage - 1];
    //console.log("3------"+outputList);

/*
  res.render("techEvents", {
    values: output
  });  */

  res.render('techEvents', {
	  values: outputList,
      pageSize: pageSize,
      totalStudents: totalStudents,
      pageCount: tpageCount,
      currentPage: currentPage
  });
};


//Fun Events page - FunEvents.ejs
exports.listFunEvents = function(req, res) {

	var currentPage = 1;
	//console.log("PageCount is " + fpageCount);
    //console.log("TotalStudents is " + totalEvents);
	if (typeof req.query.page !== 'undefined') {
    	//console.log("2");
        currentPage = +req.query.page;
        //console.log("currentPage is " + currentPage)
    }
	outputList = outputFunArrays[+currentPage - 1];
    //console.log("3------"+outputList);

  res.render('funEvents', {
	  fun: outputList,
      pageSize: pageSize,
      totalStudents: totalEvents,
      pageCount: fpageCount,
      currentPage: currentPage
  });
};

//Single Tech Event page - techEventDetails.ejs
exports.listTechEventDetails = function(req, res) {
	if(req.session.email){
		var eventid = req.param("id");
		var eventType = req.param("type");
		var eventCategory = req.param("cat");
		//console.log("id= " + eventid,"type="+eventType, "cat"+eventCategory);

		if(eventCategory == 'tech'){
            for(var i = 0; i < 3; i++) {

                var randomNumber = Math.floor(Math.random() * goutput.length)
                //console.log(goutput.length);
                //console.log("inside recommendations" + randomNumber)
                recommend[i]=goutput[randomNumber];
            }

            for( var i=0;i<goutput.length; i++){
				if(goutput[i].id == eventid && goutput[i].type == eventType){
		        //console.log(req.session.email)
					event={};
					event.userid = req.session.email;
					event.id=eventid;
					event.type=eventType;
					event.category=eventCategory;

		          	mongo.connect(mongoURL, function(){
		          		//console.log('Connected to mongo at: ' + mongoURL);
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
                    //console.log(recommend)
		        // push data into userevents collection
		        res.render("techEventDetails",{
		          values:goutput[i], recommend: recommend,
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
      var eventCategory = req.param("cat");
      //console.log("FUN!!!!!")
      //console.log("id= " + eventid,"type="+eventType, "cat"+eventCategory);

		  if (eventCategory == 'fun'){

              for(var i = 0; i < 3; i++){
                  var randomNumber =  Math.floor(Math.random() * goutputFun.length)
                  //console.log("inside recommendations" + randomNumber)
                  recommendFun[i]=goutputFun[randomNumber];
              }
		    for( var i=0;i<goutputFun.length; i++){
		      if(goutputFun[i].id == eventid){
		    	  event={};
		          event.userid = req.session.email;
		          event.id=eventid;
		          event.type=eventType;
		          event.category=eventCategory;

		          mongo.connect(mongoURL, function(){
		              //console.log('Connected to mongo at: ' + mongoURL);
		              var coll1 = mongo.collection('userevents');

		              coll1.update({
                          id: event.id},
					  	  {$set:{'userid': event.userid, 'type': event.type, 'category': event.category}},
						  {upsert: true}
		              );

		        /*      coll1.insert(event,(function(err, user){
		                  if (!err) {
		                      console.log("Details saved successfully  ");
		                  } else {
		                      console.log("returned false"+err);
		                  }
		              })); */

		          });
		          // push data into userevents collection
		        res.render("funEventDetails",{
		          fun:goutputFun[i],recommend: recommendFun,
		        });
		      }
		    }//end of for
		  }
	}
	else{
		res.render('signin', {title: 'Events in the City'});
	}

};


exports.savetechDetails = function(req, res){

	var eventid = req.body.eventid;
	var type = req.body.eventType;

	//console.log("fav eventid "+eventid);
	//console.log("fav event type "+type);

//	res.redirect('/techEvents');

	var techfvrt = {
			userid : req.session.email,
			eventid : req.body.eventid,
			type : req.body.eventType,
			category : "tech",
		};

	mongo.connect(mongoURL, function(){
		//console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('favoriteEvents');

		coll.update({
			eventid: techfvrt.eventid},
		  	  {$set:{'userid': techfvrt.userid, 'type': techfvrt.type, 'category': techfvrt.category}},
			  {upsert: true}
        );

	/*	coll.insert(techfvrt,(function(err, user){
			if (user) {

				console.log("Details saved successfully  ");

			} else {
				console.log("returned false");
			}
		})); */
	});
	res.redirect('/techEventDetails?id='+eventid+'&type='+type+'&cat=tech');
	};


	exports.savefunDetails = function(req, res){

		var funeventid = req.body.eventid;
		var funtype = req.body.eventType;

		//console.log("fav fun eventid "+funeventid);
		//console.log("fav fun event type "+funtype);

//		res.redirect('/techEvents');

		var funfvrt = {
				userid : req.session.email,
				eventid : req.body.eventid,
				type : req.body.eventType,
				category : "fun",
			};

		mongo.connect(mongoURL, function(){
			//console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('favoriteEvents');

			coll.update({
				eventid: funfvrt.eventid},
			  	  {$set:{'userid': funfvrt.userid, 'type': funfvrt.type, 'category': funfvrt.category}},
				  {upsert: true}
	        );

		/*	coll.insert(funfvrt,(function(err, user){
				if (user) {

					console.log("Details saved successfully  ");

				} else {
					console.log("returned false");
				}
			})); */
		});
		res.redirect('/funEventDetails?id='+funeventid+'&type='+funtype+'&cat=fun');
		};
