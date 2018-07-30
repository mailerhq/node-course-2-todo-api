const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{_id: new ObjectID(), text: 'First test todo'}, {_id: new ObjectID(), text: 'Second test todo', completed: true, complatedAt: 333}]

beforeEach((done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());

});

describe('POST /todos', () => {
	it('Should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text: 'Test todo text'}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should not create a new todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			// .expect((res) => {
			// 	expect(res.body.text).toBe(text);
			// })
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					// expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('Should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	})
});

describe('GET /todos/:id', () =>{
	it('Should get todo', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe('First test todo');
			})
			.end(done);
	});
	it('Should return a 404 if todo not found', (done) => {
		// make sure oyu get a 404 back
		request(app)
			.get(`/todos/${new ObjectID().toHexString}`)
			.expect(404)
			.end(done);
	});
	it('Should return a 404 for non-object ids', (done) => {
		// make sure oyu get a 404 back
		request(app)
			.get(`/todos/123`)
			.expect(404)
			.end(done);
	})
});

describe('DELETE /todos/:id', () => {
	it('should delete todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				})
				.catch((e) => done(e));
			});
	});
	it('should return a 404 if todo not found', (done) => {
		// make sure oyu get a 404 back
		request(app)
			.delete(`/todos/${new ObjectID().toHexString}`)
			.expect(404)
			.end(done);
	});
	it('should return a 404 if id not valid', (done) => {
		request(app)
			.delete(`/todos/123`)
			.expect(404)
			.end(done);
	});
});


describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var update = {text: 'changed now', completed: true}

		request(app)
			.patch(`/todos/${hexId}`)
			.send(update)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
				expect(res.body.todo.text).toBe('changed now');
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});
	it('should clear completed at when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString();
		var update = {completed: false};

		request(app)
			.patch(`/todos/${hexId}`)
			.send(update)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});
});






























