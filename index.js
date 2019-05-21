const middleware = require('socketio-wildcard')();
const server = require('./server')();
const config = require('./config');
const db = require('./config/db');
const socketController = require('./server/services/orders/conversation/conversation');

server.create(config, db);
// server.start();
const io = server.start_socket();
io.use(middleware);

io.on('connection', (socket) => {
	socket.emit('server connected');
	socket.on('*', () => {
		socketController.sendNotification(io, socket);
	});
});
