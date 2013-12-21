
/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/


/**
 * Global namespace & imports
 */
var express = require('express');
var ctrl = require('./ctrl/index');

var NODE_HTTP_PORT = 1337;
var app = express();

/**
 * Main program section
 */

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});


/**
 * route definitions
 */

// RESTful Resources
app.get('/hello', ctrl.hello);

app.get('/users', ctrl.findAll);

app.get('/users/:id', ctrl.findById);

app.post('/users', ctrl.addUser);

app.put('/users/:id', ctrl.updateUser);

app.delete('/users/:id', ctrl.deleteUser);

// SOS functions
app.post('/soscall', ctrl.sosCall);
app.post('/wifi.checkin', ctrl.wifiCheckin);


// Starting the server
app.listen(NODE_HTTP_PORT);
console.log('Node.js HTTP Server started at PORT:' + NODE_HTTP_PORT + '...');


