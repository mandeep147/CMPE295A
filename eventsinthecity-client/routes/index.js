var sess;
var http = require('http'),
  assert = require('assert');

var mongo = require("./mongoConnect");
var mongoURL = "mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295";

var fe = [];
mongo.connect(mongoURL, function(db) {
  console.log('Connected to mongo at: ' + mongoURL);

  var coll1 = db.collection('featuredEvents');
  coll1.find().toArray(function(err, result) {
    if (result.length) {
      fe = fe.concat(result[0].featuredEvents);

    } else {
      console.log(err)
    }
  })
  db.close();
});
exports.index = function(req, res) {
  //console.log(JSON.stringify(req.session.email));
  req.session.destroy();
  console.log("Featured Events!!!!");
  console.log(fe);
  res.render('index', {
    title: 'Events in the City',
    featured: fe
  });
};

exports.featured = function(req, res) {
  var eventid = req.param("id");
  console.log("Featured Events Details page!!!!");
  for (var i = 0; i < fe.length; i++) {
    if (fe[i].id == eventid) {

      event = {};

      event.id = eventid;
      event.title = fe[i].title;
      event.time = fe[i].time;
      event.description = fe[i].description;
      event.image = fe[i].image;
      event.location = fe[i].location;

      res.render('featuredEvents', {
        title: 'Events in the City',
        featuredEvent: event
      });
    };
  }
};
//Render Homepage
exports.homepage = function(req, res) {
  if (req.session.email) {
    res.render('homepage', {
      title: 'Events in the City',
      featured: fe
    });
  } else {
    res.render('signin', {
      title: 'Events in the City'
    });
  }

};
//Login
exports.clickOnLoginButton = function(req, res) {
  res.render('signin', {
    title: 'Events in the City'
  });
};



exports.about = function(req, res) {
  res.render('about');
};

exports.contactUs = function(req, res) {
  res.render('contactUs');
};
