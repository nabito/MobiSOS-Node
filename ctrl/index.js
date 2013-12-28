/**
 * Global namespace & imports
 */
var jvm = {};
jvm.java = require("java");
//var amqp = require('amqp');

// IMP do we really have to care? coz, it's already in commonJS module concept where global namespace won't be polluted

/**
 * Initialization
 */
// JVM configuration
jvm.java.classpath.push("commons-lang3-3.1.jar");
jvm.java.classpath.push("commons-io.jar");
jvm.java.classpath.push("/Users/Wirawit/eclipseWorkspace/MobiSOS-Core/MobiSOS-Core.jar");

// Java class definitions
jvm.MobiSosCore = jvm.java.import('com.dadfha.mobisos.MobiSosCore');
// Java objects
jvm.mbsCore = new jvm.MobiSosCore();

//var amqpCon = amqp.createConnection({host: 'localhost', port: 5672});

/**
 * Event Handler Functions
 */

/*
//AMQP handling
amqpCon.addListener('ready', function () {
    console.log('connected to ' + amqpCon.serverProperties.product);
    amqpCon.queue('java2nodeQueue', function(q) {
    	q.bind('#');
    	q.subscribe(function (m) {
            console.log(m.data.toString());     
        });    	
    });
});
*/


/*
var java = require("java");
java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");

java.classpath.push("/Users/Wirawit/eclipseWorkspace/MobiSOS-Core/MobiSOS-Core.jar");

// Java class definition here
var MobiSosCore = java.import('com.dadfha.mobisos.MobiSosCore');
*/



// Start Mongo server and init DB
/*
var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mobisosdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'mobisosdb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
*/

var populateDB = function() {
	
	var users = [ {
		firstname : "Steve",
		lastname : "Job",
		age : "21",
		born : "1950",
		nationality : "USA",
		remark : "PC Sucks!",
		picture : "steve_job.jpg"
	}, {
		firstname : "Bill",
		lastname : "Gates",
		age : "21",
		born : "1950",
		nationality : "USA",
		remark : "iPad Sucks!",
		picture : "bill_gate.jpg"
	} ];

	db.collection('users', function(err, collection) {
		collection.insert(users, {
			safe : true
		}, function(err, result) {
		});
	});
	
	
};


// Here is Mongoose for app specific DB
// Temporarily commented out for now (When to use MongoDB in MobiSOS? TBD)

/*

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/location');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
	console.log('yay!');
	initLocationDB();
});


var initLocationDB = function() {
	
	var locationSchema = mongoose.Schema({
		name: String,
		lat: String,
		long: String
	});
	
	// Check if loc is in m range with the location
	locationSchema.methods.inRange = function (loc, m) {
		// TODO calculate range inclusion 
		console.log('check if ' + loc.name + ' is with in ' + m + ' meters with ' + this.name);
		console.log('TBD');
	};
	
	
	var Location = mongoose.model('Location', locationSchema);
	
	var locTokyo = new Location({ name : 'Tokyo', lat : '35.6895', long : '139.6917'});
	
	var locTokyoSkyTree = new Location({ name : 'Tokyo Sky Tree', lat : '35.7100', long : '139.8184'}); 
	
	console.log(locTokyo.name);
	console.log(locTokyo.lat);
	console.log(locTokyo.long);
	console.log(locTokyo.inRange(locTokyoSkyTree, 1000));
	

//	Kitten.find(function (err, kittens) {
//		  if (err) // TODO handle err
//		  console.log(kittens)
//		});
//		
//	Kitten.find({ name: /^Fluff/ }, callback);

};


*/



/**
 * Controller Exported Functions/Variables
 */

exports.hello = function(req, res) {
	var body = 'Hello Worldooooo';	
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);	
};

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
	//res.send({id:req.params.id, name: 'Anyname', desc: 'Desc', more:'more' });
    var id = req.params.id;
    console.log('Retrieving User: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });	
};
/*
exports.addUser = function(req, res) {
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
*/
exports.addUser = function(req, res) {
	// TODO add another level of security by generating officially issued temporary token so no other people can randomly call this API
	var email = req.body.email;
	var passwd = req.body.passwd;
	var udid = req.body.udid; // should uniquely identify a device for a user
	
	var statusVal = 'ack';
	var errMsgVal = '';

	var uuid = jvm.mbsCore.createUserSync(email, passwd, udid);
	
	if(!uuid) {		
		statusVal = 'nak';
		errMsgVal = 'failed to register user.';
		console.log('Error: cannot create user of email ' + email + ' and udid ' + udid);
	} else {
		console.log('user ' + email + ' created with uuid: ' + uuid);
	}

	var reply = { 
			status: statusVal,
			uuid: uuid,			
			errMsg: errMsgVal
	};
	res.send(reply);
	
};

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    console.log(user);
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
};

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

exports.sosCall = function(req, res) {
	
	//console.log(req.body);
	
	var uid = req.body.uid;	
	var udid = req.body.udid; // should uniquely identify a device for a user
	var loc = JSON.parse(req.body.loc);
	
	var statusVal = 'ack';
	var errMsgVal = '';
	
	// relay sos call to backend
	try {
		jvm.mbsCore.sosCallSync(uid, udid, loc);	
	} catch(ex) {
		statusVal = 'nak';
		errMsgVal = 'sos call failed. please try again.';
		console.log(ex.cause.getMessageSync());
		console.log(ex.cause.printStackTraceSync());
	}

	// if succeed, return acknowledge that the SOS request is properly received
	var reply = { 
			status: statusVal,
			errMsg: errMsgVal
	};
	res.send(reply);
	
	//res.send({id:req.params.id, name: 'Anyname', desc: 'Desc', more:'more' });
	console.log('sos called with uid: ' + uid + ' location ' + JSON.stringify(loc));
};

exports.wifiCheckin = function(req, res) {
		
	//console.log(req.body);
	
	var uuid = req.body.uuid;
	var loc = JSON.parse(req.body.loc);
	var mac = req.body.mac;		// MAC address of wifi router
	
	var statusVal = 'ack';
	var errMsgVal = '';	
			
	try {
		chkResult = jvm.mbsCore.checkInWifiSync(uuid, JSON.stringify(loc), mac);
	} catch(ex) {
		statusVal = 'nak';
		errMsgVal = 'user ' + uuid + ' failed wifi check-in at timestamp ' + loc.timestamp;		
		console.log(ex.cause.getMessageSync());
		console.log(ex.cause.printStackTraceSync());
	}

	var reply = { 
			status: statusVal,
			errMsg: errMsgVal
	};
	res.send(reply);
	
	console.log('user ' + uuid + ' succeed wifi check-in at timestamp ' + loc.timestamp);
	
};




