var spawn = require('child_process').spawn,
    e  = spawn('node', ['exec.js']);

e.stdout.on('data', function (message) {
    console.log('stdout > ' + message);
});