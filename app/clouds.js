var clouds = {};

exports.addCloud = function(id, pos) {
	clouds[id] = pos;
};

exports.removeCloud = function(id) {
	delete clouds.id;
}

exports.updateCloud = function(id, pos) {
	clouds[id] = pos;
}

exports.dump = function() {
	return clouds;
}