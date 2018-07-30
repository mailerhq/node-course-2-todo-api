// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // this is using object destructuring to do same thing as above

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log("Connected to MongoDB server");

	// findOneAndUpdate
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5b5ed6f1a9ae31727649cdb1')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5b5eccf91aa6e903c94d3685')
	}, {
		$set: {
			name: "Derek"
		},
		$inc: {
			age: 20
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	// db.close();
});