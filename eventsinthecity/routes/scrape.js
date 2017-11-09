var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";
var json_re={user:"kalyani"};

var allEvents=[];
exports.scrapefun = function (req, res) {
    url = "http://www.sanjose.org/events/"
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
            var arrSJD =[];
            console.log($('.allevents-img').eq(0).attr('src'));
            console.log($('.venuetitle').eq(0).text());
            console.log($('.venuename').eq(0).text());
            console.log($('.eventtime').eq(0).text());
            for(var i=0;i<$('.venuetitle').length;i++){
            	event={};
            	event.id=i+100;
            	event.title=($('.venuetitle').eq(i).text());
            	event.time=($('.eventtime').eq(i).text());
            	event.description=" ";
            	event.url="http://www.sanjose.org/events/";
            	event.location=($('.venuename').eq(i).text());
            	event.type="SJFUN1";
            	//event.image=($('.allevents-img').eq(i).attr('src'));
            	allEvents.push(event);
            	           	
            }
            console.log(JSON.stringify(allEvents));
        }
    })
}

exports.featureEvents = function (req, res) {
    url = "http://www.sanjose.org/events/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("inside feature events");
            for(var i=0;i<$('.feature-events-div').length;i++){
                event={};
                event.id=i+1000;
                event.title=($('.captiontitle').eq(i).text());
                event.time=($('.feature-event-time').eq(i).text());
                event.description=($('.ic_text').eq(i).text());
                event.url="http://www.sanjose.org/events/";
                event.location=($('.ic_category').eq(i).text());
                event.type="Featured Events";

                event.time = event.time.replace(/\s\s+/g, ' ' );
                console.log("id: "+event.id+"\n title: "+event.title+"\n time: "+event.time+"\n description: "+event.description+"\n location: "+event.location)
                //event.image=($('.allevents-img').eq(i).attr('src'));
                allEvents.push(event);

            }
            console.log(JSON.stringify(allEvents));

            var eventobj = {"allEvents" : allEvents};

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

            res.render("scrapefun2", {
                values : allEvents
            });

        }
    })
}

exports.scrapefun2 = function (req, res) {
    url = "http://www.sanjose.org/events/?page=2"
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
            	event.id=i+111;
            	event.title=($('.venuetitle').eq(i).text());
            	event.time=($('.eventtime').eq(i).text());
            	event.description=" ";
            	event.url="http://www.sanjose.org/events/";
            	event.location=($('.venuename').eq(i).text());
               	event.type="SJFUN2";
            	//event.image=($('.allevents-img').eq(i).attr('src'));
            	allEvents.push(event);
            	           	
            }
          
            var eventobj = {"allEvents" : allEvents};
           
        	mongo.connect(mongoURL, function(){
        		console.log('Connected to mongo at: ' + mongoURL);
        		var coll1 = mongo.collection('sjscrape');
        		
        		coll1.insert(eventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		
        	});
        
            console.log(JSON.stringify(allEvents));
           res.render("scrapefun2", {
               values : allEvents
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
            var arrSF =[];
            
       /*     
            console.log($('.event .title').eq(0).text());
            console.log($('.event .date').eq(0).text());
            console.log($('.event .miles').eq(0).text());
            console.log($('.event').text());
            var myString = ($('.event').eq(0).text());
            var splits = ($('.event').eq(0).text()).split('\n', 5);
            console.log(splits[4]);
            */
        
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
            	arrSF.push(event);
            	           	
            }  
           
            var sfeventobj = {"arrSF" : arrSF};
            
        	mongo.connect(mongoURL, function(){
        		console.log('Connected to mongo at: ' + mongoURL);
        		var coll1 = mongo.collection('sfscrape');
        		
        		coll1.insert(sfeventobj,(function(err, user){
        			if (!err) {
        							
        				console.log("Details saved successfully  ");

        			} else {
        				console.log("returned false"+err);
        			}
        		}));
        		
        	});

          console.log(JSON.stringify(arrSF));
           res.render("scrapeSF", {
               values : arrSF
           });

        }
    })
}



/*
exports.scrape = function (req, res) {
    url = "https://www.siliconvalley-codecamp.com/Session/2017"
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var json1 = { title : ""};
            var arrEvents =[];
            console.log($('.currentSession').eq(0).text());
            //console.log($('.ProfessionalSession').eq(0).text());
            for(var i=0;i<$('.currentSession').length;i++){
            arrEvents.push($('.currentSession').eq(i).text().replace(/(\r\n|\n|\r)/gm,""));
            console.log($('.currentSession').eq(i).text());
            }
            
           res.render("scrape", {
               values : arrEvents
           });

        }
    })
}





exports.scrape = function (req, res) {
    url = "http://sjdowntown.com/events/"
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json = { title : ""};
            var allEvents=[];
            var arrSJD =[];
            console.log($('.dp_pec_isotope ').children().first().text());
            console.log($('span.dp_pec_date_time').eq(0).text());
            console.log($('span.dp_pec_event_title_sp').eq(0).text());
            console.log($('span.dp_pec_event_location').eq(0).text());            
            console.log($('span.dp_pec_event_description').eq(0).text());
            $('.dp_pec_content').filter(function () {
                var data = $(this);
                console.log(data)
                title = data.eq(2).text();
               // console.log("data:" +data[0])
                console.log("title: "+title)
                json.title = title;
            })

            res.send(JSON.stringify(json));
        }
    })
}


*/