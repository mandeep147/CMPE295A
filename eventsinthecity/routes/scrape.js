var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";
var json_re={user:"kalyani"};

var funeventsSJ=[];
var featuredEvents=[];
exports.scrapefun = function (req, res) {
    url = "http://www.sanjose.org/events/"
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
            var arrSJD =[];
           // console.log($('.allevents-img.img').attr('src'));
            console.log($('img').attr('src'));
          //  console.log("image http://www.sanjose.org"+$('.allevents-img img').attr('src'));
            console.log($('.venuetitle').eq(0).text());
            console.log($('.venuetitle a').eq(0).attr('href'));
            console.log($('.venuename').eq(0).text());
            console.log($('.eventtime').eq(0).text());
            console.log($('.featureeventdatemobile.hidden-lg.hidden-md.hidden-sm').eq(0).text().replace(/\s\s+/g, '' ));
            console.log($('.hidden-xs.show-print').eq(0).text());
            for(var i=0;i<$('.venuetitle').length;i++){
            	event={};
            	event.id=i+100;
            	event.title=($('.venuetitle').eq(i).text());
            	event.time=($('.featureeventdatemobile.hidden-lg.hidden-md.hidden-sm').eq(i).text().replace(/\s\s+/g, '' ))+ " " +($('.eventtime').eq(i).text().substring(11));
            	event.description=($('.hidden-xs.show-print').eq(i).text());
            	event.url="http://www.sanjose.org"+($('.venuetitle a').eq(i).attr('href'));
            	event.location=($('.venuename').eq(i).text());
            	event.type="SJFUN1";
            //	console.log("image http://www.sanjose.org"+$('.allevents-img img').eq(i).attr('src'));
            	event.image="http://www.sanjose.org"+($('.allevents-img img').eq(i).attr('src'));
            	funeventsSJ.push(event);
            	           	
            }
            console.log(JSON.stringify(funeventsSJ));
        }
    })
}

exports.scrapefun1 = function (req, res) {
    url = "http://www.sanjose.org/events/?page=2"
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
            var arrSJD =[];
           // console.log($('.allevents-img.img').attr('src'));
            console.log($('img').attr('src'));
          //  console.log("image http://www.sanjose.org"+$('.allevents-img img').attr('src'));
            console.log($('.venuetitle').eq(0).text());
            console.log($('.venuename').eq(0).text());
            console.log($('.eventtime').eq(0).text());
            console.log($('.eventtime').eq(0).text());
            for(var i=0;i<$('.venuetitle').length;i++){
            	event={};
            	event.id=i+111;
            	event.title=($('.venuetitle').eq(i).text());
            	event.time=($('.featureeventdatemobile.hidden-lg.hidden-md.hidden-sm').eq(i).text().replace(/\s\s+/g, '' ))+ " " +($('.eventtime').eq(i).text().substring(11));
            	event.description=($('.hidden-xs.show-print').eq(i).text());
            	event.url="http://www.sanjose.org"+($('.venuetitle a').eq(i).attr('href'));
            	event.location=($('.venuename').eq(i).text());
            	event.type="SJFUN2";
            //	console.log("image http://www.sanjose.org"+$('.allevents-img img').eq(i).attr('src'));
            	event.image="http://www.sanjose.org"+($('.allevents-img img').eq(i).attr('src'));
            	funeventsSJ.push(event);
            	           	
            }
            console.log(JSON.stringify(funeventsSJ));
        }
    })
}

exports.scrapefun2 = function (req, res) {
    url = "http://www.sanjose.org/events/?page=3"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
         
        //    console.log($('.allevents-img').eq(0).attr('src'));
            console.log($('.venuetitle').eq(0).text());
            console.log($('.venuename').eq(0).text());
            console.log($('.eventtime').eq(0).text());
            for(var i=0;i<$('.venuetitle').length;i++){
            	event={};
            	event.id=i+121;
            	event.title=($('.venuetitle').eq(i).text());
            	event.time=($('.featureeventdatemobile.hidden-lg.hidden-md.hidden-sm').eq(i).text().replace(/\s\s+/g, '' ))+ " " +($('.eventtime').eq(i).text().substring(11));
            	event.description=($('.hidden-xs.show-print').eq(i).text());
            	event.url="http://www.sanjose.org"+($('.venuetitle a').eq(i).attr('href'));
            	event.location=($('.venuename').eq(i).text());
               	event.type="SJFUN3";
            	//event.image=($('.allevents-img').eq(i).attr('src'));
               	event.image="http://www.sanjose.org"+($('.allevents-img img').eq(i).attr('src'));
               	funeventsSJ.push(event);
            	           	
            }
          
            var eventobj = {"funeventsSJ" : funeventsSJ};
           
        	mongo.connect(mongoURL, function(){
        		console.log('Connected to mongo at: ' + mongoURL);
        		var coll1 = mongo.collection('funEvents');
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
        
            console.log(JSON.stringify(funeventsSJ));
           res.render("scrapefun2", {
               values : funeventsSJ
           });

        }
    })
}
exports.featureEventsMain = function (req, res) {
    url = "http://www.sanjose.org/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("inside feature events");
            console.log("image http://www.sanjose.org"+$('.img-responsive.slider-event-img').attr('src'));
            console.log("title "+$('.img-responsive.slider-event-img').attr('alt'));
            console.log("Time "+$('.event-date').eq(0).text().replace(/\s\s+/g, ' ' ));
            console.log("Desc "+$('.ellipsis').eq(0).text());
            console.log("URL http://www.sanjose.org"+$('.events-slider a').attr('href'));
        
            for(var i=0;i<$('.event-date').length;i++){
                event={};
                event.id=i+3000;
                event.title=($('.img-responsive.slider-event-img').eq(i).attr('alt'));
                event.time=($('.event-date').eq(i).text());
                event.description=($('.ellipsis').eq(i).text());
                event.url="http://www.sanjose.org"+($('.events-slider a').eq(i).attr('href'));
                event.location="San Jose";
                event.type="Featured Events";

                event.time = event.time.replace(/\s\s+/g, ' ' );
                event.image="http://www.sanjose.org"+($('.img-responsive.slider-event-img').eq(i).attr('src'));
                console.log("id: "+event.id+"\n title: "+event.title+"\n time: "+event.time+"\n description: "+event.description+"\n location: "+event.location)
                //event.image=($('.allevents-img').eq(i).attr('src'));
                featuredEvents.push(event);

            }
            console.log(JSON.stringify(featuredEvents));

            /*        var eventobj = {"featuredEvents" : featuredEvents};

            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll1 = mongo.collection('featuredEvents');
                coll1.insert(eventobj,(function(err, user){
                    if (!err) {
                        console.log("Details saved successfully  ");
                    } else {
                        console.log("returned false"+err);
                    }
                }));

            });  
                        res.render("scrapefeatured", {
                values : featuredEvents
            });
            */

       }
    })
}

exports.featureEvents = function (req, res) {
    url = "http://www.sanjose.org/events/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("inside feature events");
           // console.log("image http://www.sanjose.org"+$('.feature-events-img img').attr('src'));
          //console.log("url http://www.sanjose.org"+$('.captiontitle a').eq(0).attr('href'));
            for(var i=0;i<$('.feature-events-div').length;i++){
                event={};
                event.id=i+2000;
                event.title=($('.captiontitle').eq(i).text());
                event.time=($('.feature-event-time').eq(i).text());
                var desc=($('.ic_text').eq(i).text());
                event.description=desc.slice(0,-10);
                
                event.url="http://www.sanjose.org/events/";
                event.url="http://www.sanjose.org"+($('.captiontitle a').eq(i).attr('href'));
                event.location=($('.ic_category').eq(i).text());
                event.type="Featured Events";

                event.time = event.time.replace(/\s\s+/g, ' ' );
                event.image="http://www.sanjose.org"+($('.feature-events-img img').eq(i).attr('src'));
                console.log("id: "+event.id+"\n title: "+event.title+"\n time: "+event.time+"\n description: "+event.description+"\n location: "+event.location)
                //event.image=($('.allevents-img').eq(i).attr('src'));
                featuredEvents.push(event);

            }
            console.log(JSON.stringify(featuredEvents));

            var eventobj = {"featuredEvents" : featuredEvents};

            mongo.connect(mongoURL, function(){
                console.log('Connected to mongo at: ' + mongoURL);
                var coll1 = mongo.collection('featuredEvents');
                coll1.insert(eventobj,(function(err, user){
                    if (!err) {
                        console.log("Details saved successfully  ");
                    } else {
                        console.log("returned false"+err);
                    }
                }));

            });  

            res.render("scrapefeatured", {
                values : featuredEvents
            });

        }
    })
} 

exports.scrapeSF = function (req, res) {
    url = "https://www.events12.com/sanfrancisco/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            $('.disc').remove()
            $.html()
            console.log("I'm here");
            var json1 = { title : ""};
            var funeventsSF =[];
            
            console.log($('.title').eq(0).text());
            console.log($('.date').eq(0).text());
            console.log($('.miles').eq(0).text());
            console.log("---------");
            console.log($('.columns article a').eq(1).attr('href'));
            
        //    console.log($('.columns article.style').eq(0).attr('background'));
            
          console.log($('.columns article').eq(0).text());
            var myString = ($('.columns article').eq(0).text());
            var splits = ($('.columns article').eq(0).text()).replace(/\n+/g, '\n').split('\n', 5);
            console.log("---------");
            console.log(splits);
            
     
            for(var i=0;i<$('.date').length;i++){
            	event={};
            	event.id=i+200;
            	var splits=[];
            	splits = ($('.columns article').eq(i).text()).replace(/\n+/g, '\n').split('\n', 5);
            	event.title=splits[1];
            	event.time=($('.date').eq(i).text());
            	
            	//event.description=($('.event').eq(i).text());
               	
            	event.description=splits[4];
            	
            	event.url=($('.columns article a').eq(i).attr('href'));
            	
            	var str = $('.miles').eq(i).text();
            //	event.location=($('.event .miles').eq(i).text());
               	if(str.includes("mile"))
            		event.location=($('.miles').eq(i).text()) + " of San Francisco";
            	else
            		event.location=($('.miles').eq(i).text());

            	event.type="SFFUN";
            	event.image="";
            	funeventsSF.push(event);
            	           	
            }  
           
            var sfeventobj = {"funeventsSF" : funeventsSF};
            
        	mongo.connect(mongoURL, function(){
        		console.log('Connected to mongo at: ' + mongoURL);
        		var coll1 = mongo.collection('funEvents');
        		var coll2 = mongo.collection('techfunEvents');
        		
        		coll1.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		coll2.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		
        	});

          console.log(JSON.stringify(funeventsSF));
           res.render("scrapeSF", {
               values : funeventsSF
           });

        }
    })
}
/* DO NOT REMOVE
exports.scrapeSF = function (req, res) {
    url = "https://www.events12.com/sanfrancisco/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
            var funeventsSF =[];
            
            console.log($('.events .title').eq(0).text());
            console.log($('.events .date').eq(0).text());
            console.log($('.events .miles').eq(0).text());
            console.log($('.events').text());
            var myString = ($('.event').eq(0).text());
            var splits = ($('.event').eq(0).text()).split('\n', 5);
            console.log(splits[4]);
            
     
            for(var i=0;i<$('.event').length;i++){
            	event={};
            	event.id=i+200;
            	event.title=($('.event .title').eq(i).text());
            	event.time=($('.event .date').eq(i).text());
            	
            	event.description=($('.event').eq(i).text());
               	var splits=[];
            	splits = ($('.event').eq(i).text()).replace(/\n+/g, '\n').split('\n', 5);
            	event.description=splits[4];
            	
            	event.url="https://www.events12.com/sanfrancisco/";
            	
            	var str = $('.event .miles').eq(i).text();
            //	event.location=($('.event .miles').eq(i).text());
               	if(str.includes("mile"))
            		event.location=($('.event .miles').eq(i).text()) + " of San Francisco";
            	else
            		event.location=($('.event .miles').eq(i).text());

            	event.type="SFFUN";
            	funeventsSF.push(event);
            	           	
            }  
           
            var sfeventobj = {"funeventsSF" : funeventsSF};
            
        	mongo.connect(mongoURL, function(){
        		console.log('Connected to mongo at: ' + mongoURL);
        		var coll1 = mongo.collection('funEvents');
        		var coll2 = mongo.collection('techfunEvents');
        		
        		coll1.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		coll2.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		
        	});

          console.log(JSON.stringify(funeventsSF));
           res.render("scrapeSF", {
               values : funeventsSF
           });

        }
    })
}

exports.scrapeSF = function (req, res) {
    url = "https://www.events12.com/sanfrancisco/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
            var funeventsSF =[];
            
            console.log($('.qq .title').eq(0).text());
            console.log($('.qq .date').eq(0).text());
            console.log($('.qq .miles').eq(0).text());
            console.log($('.qq').eq(0).text());
            var myString = ($('.qq').eq(0).text());
            var splits = ($('.qq').eq(0).text()).split('\n', 5);
            console.log(splits[4]);
            console.log(splits[1]); 
            console.log($('.imagebox').attr('src'));
            
     
            for(var i=0;i<$('.qq').length;i++){
            	event={};     	
            	
            //	event.description=($('.qq').eq(i).text());
               	var splits=[];
            	splits = ($('.qq').eq(i).text()).replace(/\n+/g, '\n').split('\n', 5);
            	event.id=i+200;
            	event.title=splits[1];
            	event.time=($('.qq .date').eq(i).text());
            	event.description=splits[4];
            	
            	event.url="https://www.events12.com/sanfrancisco/";
            	
            	var str = $('.qq .miles').eq(i).text();
               	if(str.includes("mile"))
            		event.location=($('.qq .miles').eq(i).text()) + " of San Francisco";
            	else
            		event.location=($('.qq .miles').eq(i).text());

            	event.type="SFFUN";
            	event.image="";
            	funeventsSF.push(event);
            	           	
            }  
           
            var sfeventobj = {"funeventsSF" : funeventsSF};
            
        	mongo.connect(mongoURL, function(){
        		console.log('Connected to mongo at: ' + mongoURL);
        		var coll1 = mongo.collection('funEvents');
        		var coll2 = mongo.collection('techfunEvents');
        		
        		coll1.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		coll2.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		
        	});   

          console.log(JSON.stringify(funeventsSF));
           res.render("scrapeSF", {
               values : funeventsSF
           });

        }
    })
}
*/
