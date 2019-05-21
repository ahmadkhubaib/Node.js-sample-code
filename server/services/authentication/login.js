const jwt = require('jsonwebtoken');
const {
	promisify,
} = require('util');
const Validator = require('validator');
const db = require('../../../config/db');
const redisFile = require('../../services/authentication/blacklist');


// eslint-disable-next-line prefer-destructuring
const client = redisFile.client;
const getAsync = promisify(client.incr).bind(client);

client.on('error', (err) => {
	// eslint-disable-next-line no-console
	console.log(`Error ${err}`);
});

async function JIT_COUNTER() {
	try {
		return await getAsync('COUNT');
	} catch (e) {
		return -1;
	}
}

const getCount = async callback => callback(await JIT_COUNTER());
	// const count = await JIT_COUNTER();

const User = require('../../models/User');

// eslint-disable-next-line camelcase
// const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;

const httpResponses = {
	onUserNotFound: {
		success: false,
		message: 'User not found.',
	},
	onAuthenticationFail: {
		success: false,
		message: 'Password is not correct',
	},
	onUnexpectedError: {
		success: false,
		message: 'Unexpected error occured while loggin in user.',
	},
	onTokenCreationError: {
		success: false,
		message: 'Error in creating your token.',
	},
	onEmailValidationError: {
		success: false,
		message: 'E-mail is required or invalid.',
	},
	onPasswordValidationError: {
		success: false,
		message: 'Password is required or invalid.',
	},
	onUserDisabled: {
		success: false,
		message: 'User is Disabled.',
	},
	onBadRequest: {
		success: false,
		message: 'Bad request',
	},
};

// eslint-disable-next-line consistent-return
function loginUser(request, response) {
	// const email = (`${request.body.email}`).trim();
	// const password = (`${request.body.password}`).trim();
	// const email = request.body.email.toString().trim();
	// const password = request.body.password.toString().trim();

	if (request.method !== 'POST') {
		return response.status(403).send(httpResponses.onBadRequest);
	}

	if (!Validator.isEmail(request.body.email.toString().trim())) {
		return response.status(400).send(httpResponses.onEmailValidationError);
	}

	// if (!password_regex.test(password)) {
	// 	return response.status(400).send(httpResponses.onPasswordValidationError);
	// }

	User.findOne({
		email: request.body.email.toString().trim(),
	// eslint-disable-next-line consistent-return
	}, {
		id: 1,
		uType: 1,
		uData: 1,
		password: 1,
		isDisabled: 1,
	}, (error, user) => {
		if (error) {
			return response.status(400).send(httpResponses.onUnexpectedError);
		}
		if (!user) {
			return response.status(400).send(httpResponses.onUserNotFound);
		}
		if (user.isDisabled) {
			return response.status(400).send(httpResponses.onUserDisabled);
		}
		// Check if password matches
		// eslint-disable-next-line consistent-return
		user.comparePassword((request.body.password.toString().trim()), (nexterror, isMatch) => {
			if (isMatch && !nexterror) {
				const getCOUNT = async () => {
					await getCount((COUNT) => {
						if (COUNT) {
							const payload = {
								uid: user.id,
								uType: user.uType,
								idd: user.uData,
								jit: COUNT,
							};
							const privateKEY = db.secret;
							const signOptions = {
								expiresIn: '48h',
								algorithm: 'HS512',
							};
							jwt.sign(payload, privateKEY, signOptions,
								(tokenError, token) => {
									if (tokenError) {
										return response.status(400).send(httpResponses.onTokenCreationError);
									}
									return response.send({
										success: true,
										message: `JWT ${token}`,
									});
								});
						}
					});
				};
				getCOUNT();
			} else {
				return response.status(401).send(httpResponses.onAuthenticationFail);
			}
		});
	});
}

module.exports = {
	loginUser,
};
