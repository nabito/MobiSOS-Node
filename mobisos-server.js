
/**
 * Global namespace & imports
 */
const NODE_HTTP_PORT = 1337;

var express = require('express')
, cors = require('cors')
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server)
, ctrl = require('./ctrl/index');


/**
 * Main program section
 */
ctrl.setSocketIo(io);

app.configure(function () {
	app.use(cors());
	//app.use(app.router);
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
app.post('/tracking', ctrl.tracking);
app.post('/soscall', ctrl.sosCall);
app.post('/wifi.checkin', ctrl.wifiCheckin);
app.post('/tag.checkin', ctrl.tagCheckin);
app.post('/checkin', ctrl.checkin);
app.get('/checkin/:uuid/:from/:until', ctrl.getCheckin);


// Starting the server
//app.listen(NODE_HTTP_PORT); // commented out for socket.io compliant
server.listen(NODE_HTTP_PORT, function() {
	console.log('Node.js HTTP Server started at PORT:' + NODE_HTTP_PORT + '...');	
});


// Socket.io
io.sockets.on('connection', function (socket) {		
	socket.on('notifyFromClient', function (data) {
		console.log(data);
	});
});



