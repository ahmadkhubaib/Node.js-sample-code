const request = require('supertest');
// const config = require('../config');
const db = require('../config/db');
const server = require('../server/index')();

server.create({
	hostname: 'localhost',
	port: 8092,
}, db);
let app;
const newDate = new Date();

beforeAll(async () => {
	Date = class extends Date {
		constructor() {
			super();
			return newDate;
		}
	};
	app = await server.start();
	console.log('starting');
});

afterAll(() => {
	// done();
	app.close();
	console.log('server closed');
});

let pharmaJWT = '';
let patientJWT = '';
let pharmaID = '';
let orderID = 0;

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

describe('Test the /login path of Pharmacist', () => {
	test('It should respond with 200', (done) => {
		request(app).post('/v1/login')
			.send({
				email: 'player.gamer.881@gmail.com',
				password: 'abcd1234',
			})
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

describe('Test the /login path of Patient', () => {
	test('It should respond with 200', (done) => {
		request(app).post('/v1/login')
			.send({
				email: 'useraccount@medmee.co',
				password: 'abcd1234',
			})
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.success).toBe(true);
				patientJWT = response.body.message;
				done();
			});
	});
});


describe('Test the /profile path of Pharmacist', () => {
	test('It should respond with 200', (done) => {
		request(app).post('/v1/profile')
			.set('Accept', 'application/json')
			.set('Authorization', pharmaJWT)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.success).toBe(true);
				pharmaID = response.body.message.pharmacyData._id;
				done();
			});
	});
});

describe('Test the /profile path of Patient', () => {
	test('It should respond with 200', (done) => {
		request(app).post('/v1/profile')
			.set('Accept', 'application/json')
			.set('Authorization', patientJWT)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.success).toBe(true);
				done();
			});
	});
});

describe('Test the /orders/place path', () => {
	test('It should respond with 200 and oid', (done) => {
		request(app).post('/v1/orders/place')
			.send({
				pharmaID,
				isPickup: true,
				priority: false,
				delivery: {},
				isOTC: false,
				prescriptionPictures: ['https://s3.eu-central-1.amazonaws.com/reqsc/-2019-apr-7-001.jpg', 'https://s3.eu-central-1.amazonaws.com/reqsc/-2019-apr-7-003.jpg'],
				notes: ['process it faster'],
				pickupTime: {
					startTime: newDate,
					endTime: newDate.setHours(newDate.getHours() + 4),
				},
			})
			.set('Accept', 'application/json')
			.set('Authorization', patientJWT)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.statusCode).toBe(200);
				expect(response.body.success).toBe(true);
				expect(typeof response.body.oid).toBe('number');
				orderID = response.body.oid;
				done();
			});
	});
});

describe('Test the /orders/update/:oid path', () => {
	test('It should respond with 200', (done) => {
		request(app).put(`/v1/orders/update/${orderID}`)
			.send({
				products: [{
					productName: 'amoxyl',
					productQuantity: 25,
					form: 'tablet',
					amount: '500mg',
					price: 4,
				}, {
					productName: 'flagyl',
					productQuantity: 15,
					form: 'tablet',
					amount: '500mg',
					price: 8,
				}],
			})
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

describe('Test the /orders/activity/set/:oid path for status 1', () => {
	test('It should respond with 200', (done) => {
		request(app).post(`/v1/orders/activity/set/${orderID}`)
			.send({
				orderStatus: 1,
				duePayment: 2500,
			})
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

// TODO - add test for order payment is paid successfully
// TODO - add test for order processing after payment is verfied successfully
