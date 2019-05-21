const redis = require('redis');
const decode = require('jwt-decode');
require('dotenv').config();


// console.log(process.env.REDIS);
const client = redis.createClient(process.env.REDIS_URL);

client.on('error', (err) => {
    console.log(`Error ${err}`);
});

const blacklist = (request, response) => {
	const token = decode(request.body.token);
	if (token !== null) {
		client.set(token.jit, 'INVALID', 'EX', 172800);
		// client.end(true);
		return response.status(200).send({
			success: true,
			message: 'Token blacklisted.',
		});
	}
};

module.exports = {
	blacklist,
	client,
};
