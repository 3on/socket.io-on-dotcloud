function Cloud () {
	var socket = io.connect('/');
	var canvas = undefined;
	var ctx = undefined;
	var self = this;
	var images = [];
	var socketIO = undefined;


	/*
		Socket.io's code
	*/
	function ioInit () {
		socket.on('connect', function() {
			console.log(socket.socket.sessionid)
		});

		// data = [{id: QSDDqsdqdqdq_d, x: 42, y: 42}, {id: 23123131, x: 42, y: 42} ]
		socket.on('update', function(data){
			self.draw(data);
		});
		
		// data = {x: 42, y: 42}
		this.move = function(data) {
			socket.emit('move', data);
		}

		socket.on('progress', function(data){
			self.progress(data.pourcent);
		});

		socket.on('test', function(data){
			console.log("test", data);
		});
	}

	/*
		Canvas drawing code
	*/

	// preload images
	function preaload() {
		var cb = arguments[0];
		var nbPics = arguments.length - 1;
		delete arguments[0];

		for(i in arguments) {
			var filename = arguments[i];
			var name = filename.slice(0, filename.lastIndexOf('.'));

			images[name] = new Image();
			images[name].src = "/img/" + filename;
			images[name].onload = function() {
				--nbPics;
				if (nbPics === 0) {
					console.log("> All pictures have been loaded");
					cb()
				}
			};
		}
	}

	function start() {
		socketIO = new ioInit();

		// mouse events
		$("#clouds").mousemove(function(e){
			socketIO.move({x: e.offsetX, y: e.offsetY})
		});
	}

	// Grab the canvas and initiate the context
	this.init = function(cb){
		canvas = document.getElementById('clouds');
		ctx = canvas.getContext('2d');

		// load the images and then call the callback to start the "game"
		preaload(start, 'dotcloud.png');

		return self;
	};


	// draw a texture
	function drawCloud(pos, alpha) {
		var img = images['dotcloud'];
		var width = img.width;
		var height = img.height;

		var x = width / 2;
		var y = height / 2;

		ctx.save();
		ctx.globalAlpha = (alpha)? alpha : 1;
		ctx.drawImage(img, 0, 0, width, height, pos.x - x, pos.y - y, width, height);
		ctx.restore();
	}

	// update the canvas
	this.draw = function(data){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		data.forEach(function(e){
			if(e.id != socket.socket.sessionid) {
				drawCloud(e, 0.2);
			}
			else {
				drawCloud(e, 1);
			}
		})
	};

	this.progress = function(pourcent){
		console.log(pourcent)
		$("progress").attr('value', pourcent);
	}

	this.exec = function() {
		socket.emit('exec');
	}

	this.initProgress = function(){
		socketIO = new ioInit();
		return self;
	};

}
