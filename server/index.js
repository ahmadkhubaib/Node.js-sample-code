const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const socketio = require('socket.io');
const counterSetup = require('./models/Counter');

require('../config/passport')(passport);

const routes = require('./routes');

/* eslint-disable func-names */
module.exports = function () {
	const server = express();

	const create = function (config, db) {
		// Server settings
		server.set('env', config.env);
		server.set('port', config.port);
		server.set('hostname', config.hostname);

		// SSL enforce
		function requireHTTPS(request, response, next) {
			if (config.env === 'production' && !request.secure && request.get('x-forwarded-proto') !== 'https') {
				return response.redirect(`https://${request.get('host')}${request.url}`);
			}
			// console.log(config.env);
			// The 'x-forwarded-proto' check is for Heroku
			// if (!request.secure && request.get('x-forwarded-proto') !== 'https'
			// && config.env === 'local') {
			// 	return response.redirect(`https://${request.get('host')}${request.url}`);
			// }
			next();
		}
		server.use(requireHTTPS);
		// Network Middlewares
		const whiteList = ['https://empathium-be.herokuapp.com', 'http://localhost:3000'];
		server.use(helmet());
		server.use(cors({
			origin(origin, callback) {
				if (whiteList.indexOf(origin) === -1 && origin) {
					console.log(origin);
					return callback(new Error(11)); // ERR CODE 11 : CORS CHECK FAIL
				}
				return callback(null, true);
			},
			allowedHeaders: 'Content-Type,Authorization',
		}));

		// Error handler
		server.use((err, request, response, next) => {
			// console.error(err.stack)
			switch (err.message) {
				case '11': // for CORS()
					response.status(403).send('Invalid request.');
					break;
				default:
					break;
			}
		});
		// Middleware exceptions
		server.use('/v1/payments/webhooks', bodyParser.raw({
			type: '*/*',
		}));
		const EventHandlerMid = function (request, response, next) {
			response.writeHead(200, {
				Connection: 'keep-alive',
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Access-Control-Allow-Origin': '*',
			});
			next();
		};
		server.use('/v1/webhooks/events', EventHandlerMid);
		// Compression middleware
		server.use(compression());
		// Middleware requests parsers
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({
			extended: false,
		}));
		// Middleware logger
		server.use(logger('dev'));
		// Authentication middleware
		server.use(passport.initialize());
		// Database init
		mongoose.connect(db.database, {
			useNewUrlParser: true,
			useCreateIndex: true,
		}).then(() => console.log('DB connection successful'));
		// set up counter if not exists
		const query = {
			_id: 'counter',
		};
		const update = {};
		const options = {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true,
		};

		// set flag to true to remove warnings
		mongoose.set('useFindAndModify', true);

		// Find the document
		counterSetup.findOneAndUpdate(query, update, options, (error, result) => {
			if (error) {
				console.log('Error while initializing counter');
				return false;
			}
			// do something with the document
			console.log('Counter initialized');
		});

		// set flag to false to enable warnings for future
		mongoose.set('useFindAndModify', false);

		// Set up routes
		routes.init(server);
	};

	const start = function () {
		return server.listen(server.get('port'), () => {
			console.log(`server listening on - http://${server.get('hostname')}:${server.get('port')}`);
		});
	};
	const start_socket = function () {
		const mServer = server.listen(server.get('port'), () => {
			console.log(`server listening on - http://${server.get('hostname')}:${server.get('port')}`);
		});
		const io = socketio(mServer);
		return io;
	};

	return {
		create,
		start,
		start_socket,
	};
};
