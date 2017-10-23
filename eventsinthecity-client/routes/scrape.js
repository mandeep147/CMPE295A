/**
 * Created by mandeep on 9/13/17.
 */

/*
var graph = require('facebook-complete');
var conf = {
    client_id:      '118045498900273',
    client_secret:  'ffab260e64b70e769b501acf3fbf795a',
    scope:          'email, user_about_me, user_birthday, user_location, publish_stream',
    redirect_uri:   'http://localhost:3000/auth/facebook'
};
*//*
let cheerio = require('cheerio')
//let $ = cheerio.load('http://sjdowntown.com/events/')
let $ = cheerio.load('https://www.siliconvalley-codecamp.com/Session/2017')

exports.scrape = function (req, res) {
    var companiesList = [];
    console.log("inside scrape")
    $('#session_7337').each(function(index, element){
        companiesList[index] = {};
        console.log("inside $")
        var header = $(element).find('[ProfessionalSession]');
        companiesList[index]['title'] = header
        console.log(companiesList)
        res.send(companiesList);
    })
    res.end();
}*/

/*
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


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
            arrEvents.push($('.currentSession').eq(i).text().replace(/(\r\n|\n|\r)/gm,"/n"));
            console.log($('.currentSession').eq(i).text());
            }

           res.render("scrape", {
               values : arrEvents
           });

        }
    })
}




/*
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

/*
exports.scrapefun = function (req, res) {
    url = "http://www.sanjose.org/events/"
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);
            console.log("I'm here");
            var json1 = { title : ""};
            var allEvents=[];
            var arrSJD =[];

            console.log($('.allevents-img').eq(0).attr('src'));
            console.log($('.venuetitle').eq(0).text());
            console.log($('.venuename').eq(0).text());
            console.log($('.eventtime').eq(0).text());
            for(var i=0;i<$('.venuetitle').length;i++){
            	event={};
            	event.title=($('.venuetitle').eq(i).text());
            	event.name=($('.venuename').eq(i).text());
            	event.time=($('.eventtime').eq(i).text());
            	event.image=($('.allevents-img').eq(i).attr('src'));
            	allEvents.push(event);

            }

            console.log(JSON.stringify(allEvents));
           res.render("scrapefun", {
               values : allEvents
           });

        }
    })
}
*/
