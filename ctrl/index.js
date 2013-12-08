
/**
 * import section
 */
var java = require("java");
java.classpath.push("commons-lang3-3.1.jar");
java.classpath.push("commons-io.jar");

java.classpath.push("/Users/Wirawit/eclipseWorkspace/MobiSOS-Core/MobiSOS-Core.jar");



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






/**
 * Controller
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
	
	var uid = req.params.id;
	var loc = req.params.loc;
	
	/*
	var ArrayList = java.import('java.util.ArrayList');
	var list = new ArrayList();
	list.addSync('item1');
	
	console.log(list.getSync(0));		
	*/
	
	// TODO update latest location to DB and start real-time tracking mode
	// Let the server call Java to query semantic DB for nearby nodes
	// then ask for tracking record "Do you see Bob?"
	
	// return acknowledge that the SOS request is properly received
	res.send('ack');
	
	//res.send({id:req.params.id, name: 'Anyname', desc: 'Desc', more:'more' });
	console.log('got called!');
};

exports.wifiCheckin = function(req, res) {
		
	console.log(req.body);
	
	var uid = req.body.uid;
	var loc = JSON.parse(req.body.loc);
	var mac = req.body.mac;	
	
	console.log('my fake id is ' + uid);
	console.log('my timestamp is ' + loc.timestamp);
	
	// Java class definition here
	var MobiSosCore = java.import('com.dadfha.mobisos.MobiSosCore');
	
	var core = new MobiSosCore();
	
	// FIXME user registration should be done else where
	var user = core.createUserSync('nabito@gmail.com', 'pwd');
	var realUid = user.getPropertySync(core.PROP_UUID).getStringSync();
	console.log('realUID is ' + realUid);
	
	var chkResult = false;
	
	try {
		chkResult = core.checkInWifiSync(realUid, JSON.stringify(loc), mac);
	} catch(ex) {
		console.log(ex.printStackTrace());
	}
		
	if(chkResult) {
		res.send('ack');
		console.log('user ' + uid + ' succeed wifi check-in at timestamp ' + loc.timestamp);
	} else {
		res.send('nak');
		console.log('user ' + uid + ' failed wifi check-in at timestamp ' + loc.timestamp);
	}	
	
};




