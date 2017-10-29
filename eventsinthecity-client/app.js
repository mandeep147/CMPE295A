var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var events=require('./routes/events');
var login = require('./routes/login');

var scrape = require('./routes/scrape');

var app = express();

app.use(session({
	  secret: 'my_secret',
	  resave: false,
	  saveUninitialized: false,
	  duration: 30 * 60 * 1000,    
	  activeDuration: 5 * 60 * 1000,
	  store: new MongoStore({ url: 'mongodb://ec2-54-183-239-166.us-west-1.compute.amazonaws.com:27017/cmpe295' })
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/login', login.login);
app.post('/register',login.register);

app.get('/events',events.listEvents);
app.post('/nextpage',events.nextpage);
app.get('/nextpage',events.listEventDetails)
//app.get('/eventDetails',events.listEventDetails);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
