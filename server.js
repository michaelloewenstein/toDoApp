//dependencies
var express = require("express");
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var bodyParser = require('body-parser');// pull information from HTML POST (express4)	
var http = require('http');

var database = require('./config/database');
mongoose.connect(database.url); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("db connection open");
});

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


var routes = require('./routes');
routes(app);

// listen (start app with node server.js) ======================================
app.server = http.createServer(app);
app.server.listen(2002);
console.log("App listening on port 2002");

//socket.io
var updater = require("./updater");
updater(app.server);