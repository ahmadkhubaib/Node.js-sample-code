const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { promisify } = require('util');
const redisFile = require('./../server/services/authentication/blacklist');

// eslint-disable-next-line prefer-destructuring
const client = redisFile.client;

const getAsync = promisify(client.get).bind(client);

client.on('error', (err) => {
    console.log(`Error ${err}`);
});

async function checkInBL(jit) {
	try {
		return await getAsync(jit);
	} catch (e) {
		return 'VALID';
	}
}

const isJwtBlack = async (jit, callback) => {
	const value = await checkInBL(jit);
	// console.log(value);
	return callback(value);
};

const User = require('../server/models/User');
const config = require('./db');

function setPassportConfigs(passport) {
	const opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = config.secret;

	passport.use(new JwtStrategy(opts, ((jwtPayload, done) => {
		const getBL = async () => {
			await isJwtBlack((jwtPayload.jit), (bl) => {
				if (bl === 'INVALID') {
					return done(null, false, {
								message: 'User blacklisted.',
							});
				}
				User.findOne({
				id: jwtPayload.id,
				}, (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
				});
			});
		};
		getBL();
})));
}

module.exports = setPassportConfigs;
