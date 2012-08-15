function Cloud () {
	var socket = io.connect('http://localhost:8080');
	var canvas = undefined;
	var ctx = undefined;
	var self = this;


	/*
		Socket.io's code
	*/
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

	/*
		Canvas drawing code
	*/
	// Grab the canvas and initiate the context
	this.init = function(){
		canvas = document.getElementById('clouds')
		ctx = canvas.getContext('2d');
		return self;
	};

	// shape drawing
	function drawRectangle(pos, color){
		var width = 260;
		var height = 120;

		var x = width / 2;
		var y = height / 2;

		ctx.save();
		ctx.fillStyle = (color)?color:"rgba(42,42,42, 0.4)";
		//ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.fillRect(pos.x - x, pos.y - y, width, height);
		ctx.restore();
	}

	// update the canvas
	this.draw = function(data){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		data.forEach(function(e){
			if(e.id != socket.socket.sessionid)
				drawRectangle(e);
			else
				drawRectangle(e, "rgba(10, 20, 255, 1)")
		})
	};

	// mouse events
	$("#clouds").mousemove(function(e){
		self.move({x: e.offsetX, y: e.offsetY})
	});

}
