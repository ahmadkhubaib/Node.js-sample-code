const request = require('supertest');
// const config = require('../config');
const db = require('../config/db');
const server = require('../server/index')();

server.create({
	hostname: 'localhost',
	port: 8091,
}, db);
let app;

beforeAll(async () => {
	// do something
	app = await server.start();
	console.log('starting');
});

afterAll(() => {
	// done();
	app.close();
	console.log('server closed');
});


describe('Test the / root path', () => {
    test('It should respond with 404', (done) => {
		request(app).get('/v1')
		.set('Accept', 'application/json')
		.then((response) => {
            expect(response.statusCode).toBe(404);
            done();
        });
    });
});

let pharmaJWT = '';

describe('Test the /login path', () => {
    test('It should respond with 200', (done) => {
		request(app).post('/v1/login')
		.send({ email: 'metropolitan@medmee.co', password: 'abcd1234' })
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.then((response) => {
            expect(response.statusCode).toBe(200);
			expect(response.body.success).toBe(true);
			pharmaJWT = response.body.message;
			done();
        });
    });
});

describe('Test the /profile path', () => {
    test('It should respond with 200', (done) => {
		request(app).post('/v1/profile')
		.set('Accept', 'application/json')
		.set('Authorization', pharmaJWT)
		.expect('Content-Type', /json/)
		.then((response) => {
            expect(response.statusCode).toBe(200);
			expect(response.body.success).toBe(true);
			done();
        });
    });
});
