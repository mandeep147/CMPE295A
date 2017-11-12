
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var events=require('./routes/events');
var login = require('./routes/login');

var scrape = require('./routes/scrape');
var meetupSF = require('./routes/meetupSF');
var meetupSJ = require('./routes/meetupSJ');
var eventbriteSJ = require('./routes/eventbriteSJ');
var eventbriteSF = require('./routes/eventbriteSF');

var app = express();

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

app.get('/events',events.searchEvents);
app.get('/scrapefun', scrape.scrapefun);
app.get('/featured', scrape.featureEvents);
app.get('/scrapefun2', scrape.scrapefun2);
app.get('/scrapeSF', scrape.scrapeSF);
app.get('/eventbriteSF',eventbriteSF.searchEbSFEvents);
app.get('/eventbriteSJ',eventbriteSJ.searchEbSJEvents);
app.get('/meetupSJ', meetupSJ.searchMeetupSJEvents);
app.get('/meetupSF', meetupSF.searchMeetupSFEvents);

app.post('/login', login.login);
app.post('/register',login.register);
app.post('/nextpage',events.nextpage);
app.get('/nextpage',events.eventDetailsget)
//app.get('/eventDetails',events.eventDetailsget);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
