
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , tools = require('./tools.js');

var io = require('socket.io');

// express work to be compatible with Express 3
var app = express();
var server = http.createServer(app);
var io = io.listen(server);

app.configure(function(){
  app.set('port', process.env.WWW_PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/',function(req, res){
  res.render('index');
});


io.sockets.on('connection', function(socket){
  tools.log(socket);

  socket.on('disconnect', function(){
    tools.log("Socket disconect")
  });
})


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
