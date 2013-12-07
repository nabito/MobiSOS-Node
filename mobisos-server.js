
/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/


/**
 * import section
 */
var express = require('express');
var ctrl = require('./ctrl/index');


var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

/**
 * route definitions
 */

// User Resource
app.get('/hello', ctrl.hello);

app.get('/users', ctrl.findAll);

app.get('/users/:id', ctrl.findById);

app.post('/users', ctrl.addUser);

app.put('/users/:id', ctrl.updateUser);

app.delete('/users/:id', ctrl.deleteUser);

// SOS functions
app.get('/soscall/:id', ctrl.sosCall);




app.listen(1337);
console.log('Listening 1337');