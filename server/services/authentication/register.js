/* eslint-disable camelcase */
const Validator = require('validator');
const jwt = require('jsonwebtoken');
const {
	promisify,
} = require('util');
const randomstring = require('randomstring');
const User = require('../../models/User');
const Pharma = require('../../models/Pharma');
const Patient = require('../../models/Patient');
const Courier = require('../../models/Courier');
const Pharmacist = require('../../models/Pharmacist');
const db = require('../../../config/db');
const redisFile = require('../../services/authentication/blacklist');

// eslint-disable-next-line prefer-destructuring
const client = redisFile.client;
const getAsync = promisify(client.incr).bind(client);

client.on('error', (err) => {
	console.log(`Error ${err}`);
});

async function JIT_COUNTER() {
	try {
		return await getAsync('COUNT');
	} catch (e) {
		return -1;
	}
}

const getCount = async (callback) => {
	const count = await JIT_COUNTER();
	return callback(count);
};

const uType_regex = /^([1-4])$/;
const uName_regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,32}$/;
const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
const random = randomstring.generate({
	length: 3,
	charset: 'numeric',
});

function generateUsername(uName) {
	return uName.replace(/\s/g, '') + random;
}

const httpResponses = {
	onUserSaveError: {
		success: false,
		message: 'That email address already exists.',
	},
	onLastNameMissing: {
		success: false,
		message: 'Your last name is missing or invalid.',
	},
	onUserSaveSuccess: {
		success: true,
		message: 'Successfully created new user.',
	},
	onEmailValidationError: {
		success: false,
		message: 'E-mail is required or invalid.',
	},
	onuTypeValidationError: {
		success: false,
		message: 'User type is required or invalid.',
	},
	onPasswordValidationError: {
		success: false,
		message: 'Password is required or invalid.',
	},
	onUsernameValidationError: {
		success: false,
		message: 'User name is required or invalid.',
	},
	onTokenCreationError: {
		success: false,
		message: 'Error occurred in creating token.',
	},
	onUnexpectedError: {
		success: false,
		message: 'Unexpected error or invalid user type.',
	},
};

// Register new users
function registerUser(request, response) {
	const email = (`${request.body.email}`).trim();
	const password = (`${request.body.password}`).trim();
	const uName = (`${request.body.uName}`).trim();
	const {
		uType,
	} = request.body;
	if (!Validator.isEmail(email)) {
		return response.status(400).send(httpResponses.onEmailValidationError);
	}

	if (!password_regex.test(password)) {
		return response.status(400).send(httpResponses.onPasswordValidationError);
	}

	if (!uType_regex.test(request.body.uType)) {
		return response.status(400).send(httpResponses.onuTypeValidationError);
	}

	if (!uName_regex.test(uName)) {
		return response.status(400).send(httpResponses.onUsernameValidationError);
	}
	if (uType === 1 && (!request.body.lName || !uName_regex.test(request.body.lName))) {
		return response.status(400).send(httpResponses.onLastNameMissing);
	}
	const age = request.body.age || 0;
	const gender = request.body.gender || 0;
	const lName = request.body.lName || '';
	User.findOne({
		email,
	}, (error, user) => {
		if (error) {
			return response.status(400).send(httpResponses.onUnexpectedError);
		}
		if (!user) {
			let COUNT;

			// eslint-disable-next-line no-underscore-dangle
			const _getCount = async () => {
				COUNT = await getCount(jit => jit);
			};
			_getCount();
			const getID = async () => {
				// eslint-disable-next-line no-use-before-define
				await registerUProfile(uType, uName, lName, age, gender, email, (uid) => {
					if (!uid) {
						return response.status(400).send(httpResponses.onUnexpectedError);
					}
					const newUser = new User({
						email,
						password,
						uType,
						username: uid.username,
						oldData: {},
						uData: uid.idd,
					});
					newUser.save((error, newUserData) => {
						if (error) {
							return response.status(400).send(httpResponses.onUserSaveError);
						}
						const payload = {
							uid: newUserData.id,
							uType,
							idd: uid.idd,
							jit: COUNT,
						};
						const privateKEY = db.secret;
						const signOptions = {
							expiresIn: '48h',
							algorithm: 'HS512',
						};
						jwt.sign(payload, privateKEY, signOptions,
							(error, token) => {
								if (error) {
									return response.status(400).send(httpResponses.onTokenCreationError);
								}
								return response.send({
									success: true,
									message: `JWT ${token}`,
								});
							});
					});
				});
			};
			getID();
		} else {
			return response.status(400).send(httpResponses.onUserSaveError);
		}
	});
}

const registerUProfile = async (uType, uName, lName, Age, Gender, email, callback) => {
	if (uType === 1) {
		const newPatient = new Patient({
			fname: uName,
			lname: lName,
			age: Age,
			gender: Gender,
			uType,
			url: generateUsername(uName),
			email,
		});
		await newPatient.save((error, data) => {
			if (error) {
				return callback(false);
			}
			return callback({
				idd: data.id,
				username: data.url,
			});
		});
	} else if (uType === 2) {
		const newPharma = new Pharma({
			pharmaName: uName,
			pharmacyUrl: generateUsername(uName),
		});
		await newPharma.save((error, data) => {
			if (error) {
				return callback(false);
			}
			const newPharmacist = new Pharmacist({
				ownerOf: new Array(data.id),
				worksAt: new Array({
					Pid: data.id,
					role: 'OWNER',
				}),
			});
			newPharmacist.save((error, pharmacist) => {
				if (error) {
					return callback(false);
				}
				return callback({
					idd: pharmacist.id,
					username: '',
				});
			});
		});
	} else if (uType === 3) {
		const newCourier = new Courier({
			courierName: uName,
		});
		await newCourier.save((error, data) => {
			if (error) {
				return callback(false);
			}
			return callback({
				idd: data.id,
				username: '',
			});
		});
	} else {
		return callback(false);
	}
};

module.exports = {
	registerUser,
};
