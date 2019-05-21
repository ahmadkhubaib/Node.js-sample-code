const apiRoute = require('./apis');
const urlHandler = require('./urlhandler/urlHandler');
// const homeRoute = require('./home');
// const errorRoute = require('./error');

function init(server) {
	// server.get('*', (req, res, next) => {
	// 	// eslint-disable-next-line no-console
	// 	console.log(`Request was made to: ${req.originalUrl}`);
	// 	return next();
	// });
	server.use('/', urlHandler);
	server.use('/', apiRoute);
}

module.exports = {
	init,
};
