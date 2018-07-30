const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove({});
Todo.findByIdAndRemove('5b5f8efda9ae31727649d6c3').then((todo) => {
	console.log(todo);
});