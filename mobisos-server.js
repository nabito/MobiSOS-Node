
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


