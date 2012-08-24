/*
     Modules requirements
*/

// Express modules requirements
var express = require('express')
  , http = require('http')
  , path = require('path');

// A wrapper to get a pretty console.log
var tools = require('./tools.js');

// One of the most usefull Js library
var _ = require('underscore');

// Socket.IO module
var io = require('socket.io');


// Some tweakering to get ot to work with Express 3 
var app = express();
var server = http.createServer(app);
var io = io.listen(server);
io.set('log level', 1); 

/*
     Express configuation and route(s)
*/

// Basic Express configuration
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

// Main route to deliver the static html
app.get('/',function(req, res){
  res.render('index');
});

app.get('/exec',function(req, res){
  res.render('progress');
});

/* 
    Socket.IO 's logic
*/

// Object/dictionary in which we store the differents sockets
var clouds = {};

var exec = function() {
  var socket = this;
  tools.log(socket)
  clouds[socket.id].socket.emit('test', {pourcent: 0});

  var spawn = require('child_process').spawn,
      e  = spawn('node', ['exec.js']);

  e.stdout.on('data', function (data) {
      var pourcent = data + "";
      pourcent = pourcent.slice(0, pourcent.indexOf("\n"));
      clouds[socket.id].socket.emit('progress', {pourcent: pourcent});
      console.log(pourcent);
  });

}

// callback for a position update from a client
var move = function(pos) {
  var socket = this;

  clouds[socket.id].pos.x = pos.x;
  clouds[socket.id].pos.y = pos.y;
}

// callback for websocket disconnetion
var disconnetion = function() {
  var socket = this;

  tools.log("Lost connection: " + socket.id);
  delete clouds[socket.id];

};

// callback for new websocket connection
var connection = function(socket){
  tools.log("new connection: " + socket.id);
  
  // add the cloud to the clouds object, and set it to be at the center of the grid
  clouds[socket.id] = {
    socket: socket,
    pos: { x: 0, y: 0 }
  };

  //bind exec
  socket.on('exec', exec);

  // bind move event
  socket.on('move', move);

  // bind disconnect event
  socket.on('disconnect', disconnetion);
};

// bind new connection event
io.sockets.on('connection', connection);

// The logic of this app is all server side driven,
// therefore even the "drawing loop" is server side.
// The server send data and ask for a redraw of the scene.
// This disable the need to sync data localy.

// map to format the dumped update data
var posOnly = function(cloud, id) {
  return {id: id, x: cloud.pos.x, y: cloud.pos.y};
};

setInterval(function(){
  for (var id in clouds) {
    clouds[id].socket.emit('update', _.map(clouds, posOnly)); 
  } 
}, 30);


// Let's start the server
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
