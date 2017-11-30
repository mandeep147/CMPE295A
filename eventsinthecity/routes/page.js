var json_responses;

var http = require('http'),
  assert = require('assert');

var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";

var output = [];
var outputArrays = [];
var outputFun = [];
var recommend=[];
var recommendFun=[];
var totalStudents = 0;
var pageSize = 9;
var pageCount = 0;

//Extract data for TechEvents data
mongo.connect(mongoURL, function(db) {
  console.log('Connected to mongo at: ' + mongoURL);
  var coll1 = db.collection('EBEvents');
  coll1.find().toArray(function(err, result) {
    if (result.length) {

      output= result;
// 	console.log(output);

     //split list into groups
       totalStudents = result.length;
       pageSize = 9;
       pageCount = Math.ceil(result.length/9);
      
     while (output.length > 0) {
     	outputArrays.push(output.splice(0, pageSize));
     	console.log("1------"+outputArrays); 
     	
     	
     }

    } else {
      console.log(err)
    }
  })
  db.close();
});


exports.displayEvents = function(req, res) {
    
	
    var currentPage = 1;
    console.log("PageCount is " + currentPage);
    console.log("TotalStudents is " + currentPage);

    console.log("1+++++++"+outputArrays.length);
    //set current page if specifed as get variable (eg: /?page=2)
    if (typeof req.query.page !== 'undefined') {
    	console.log("2");
        currentPage = +req.query.page;
        console.log("currentPage is " + currentPage);
    }

    outputList = outputArrays[+currentPage - 1];
    console.log("3------"+outputList);
    
    
    /*    console.log("1------"+outputArrays[1][1].id); 
    console.log("3------"+outputList); 
      
  console.log("3------"+outputList[1].id); 
  console.log("3++++++++++"+outputList[0].id);
    console.log("1------"+outputArrays[0][1].id); 
    console.log("2------"+outputArrays[0][2].id);
    
    
    console.log("4------"+outputArrays[0][2].id);
    
    console.log("5------"+pageCount);  */


    //render eventspage.ejs view file
    res.render('eventspage', {
    	outputList: outputList,
        pageSize: pageSize,
        totalStudents: totalStudents,
        pageCount: pageCount,
        currentPage: currentPage
    });
	

};
