const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
require('dotenv').config();
const decoder = require('jwt-decode');
const User = require('../../models/User');
const Pharmacist = require('../../models/Pharmacist');

const verifyUsers = token => new Promise((resolve, reject) => {
	if (token) {
		User.findOne({
			'userToken.activationToken': token,
		}, (err, data) => {
			if (err) {
				resolve(false);
			} else if (data) {
				const currentMillis = Date.now();
				const registrationTime = Date.parse(data.userToken.createdAt);
				const difference = currentMillis - registrationTime;
				const currentminutes = Math.round(difference / 1000 / 60);
				if (currentminutes < 1440) {
					User.updateOne({
						'userToken.activationToken': token,
					}, {
						$set: {
							'userToken.activationToken': '',
							isEmailVerified: true,
						},
					}, (err, raw) => {
						if (err) {
							resolve(false);
						} else if (raw.nModified === 0 && raw.n === 0) {
							resolve(66);
						} else if (raw.nModified === 1 && raw.n === 1 && raw.ok === 1) {
							if (data.uType === 2) {
								Pharmacist.updateOne({
									_id: data.uData,
								}, {
									$set: {
										isVerified: true,
									},
								}, (error, raw2) => {
									if (error) {
										resolve(false);
									} else if (raw2.nModified === 0 && raw2.n === 0) {
										resolve(66);
									} else if (raw.nModified === 0) {
										resolve(99);
									} else if (raw.nModified === 0 && raw.n === 0 && raw.ok === 0) {
										resolve(false);
									} else if (raw.nModified === 1 && raw.n === 1 && raw.ok === 1) {
										resolve(true);
									} else {
										resolve(false);
									}
								});
							} else {
								resolve(true);
							}
						} else if (raw.nModified === 0) {
							resolve(99);
						} else if (raw.nModified === 0 && raw.n === 0 && raw.ok === 0) {
							resolve(false);
						} else {
							resolve(false);
						}
					});
				} else if (currentminutes > 10) {
					resolve(44);
				}
			} else if (!data) {
				resolve(66);
			}
		});
	} else {
		resolve(66);
	}
});


const httpResponses = {
	onUnexpectedError: {
		success: false,
		message: 'Unexpected error occured while fetching user details.',
	},
	onUserNotFound: {
		success: false,
		message: 'User not found.',
	},
	onEmailFailed: {
		success: false,
		message: 'Error in sending email.',
	},
	onSuccess: {
		success: true,
		message: 'Verification link sent. Please check your inbox/spam folder.',
	},
	onAlreadyVerified: {
		success: false,
		message: 'This email is already verified.',
	},
};

const generateToken = () => randomstring.generate().toString();

const smtpTransport = nodemailer.createTransport({
	host: 'smtp.zoho.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: process.env.ZOHO_UNAME,
		pass: process.env.ZOHO_PASSWORD,
	},
});
const host = 'https://athenium2-be.herokuapp.com/v1/verify';

function sendVerification(request, response) {
	const token = getToken(request.headers);
	const u = decoder(token);
	User.findOne({
		_id: u.uid,
		isEmailVerified: false,
	}, (error, data) => {
		if (error) {
			return response.status(400).send(httpResponses.onUnexpectedError);
		}
		if (data) {
			const vToken = generateToken();
			const link = `${host}/${vToken}`;
			User.updateOne({
				_id: u.uid,
			}, {
				$set: {
					'userToken.activationToken': vToken,
					'userToken.createdAt': Date.now(),
				},
			}, (error) => {
				if (error) {
					return response.status(400).send(httpResponses.onUnexpectedError);
				}
				return response.send(httpResponses.onSuccess);
			});
			const mailOptions = {
				from: '"no-reply@medmee.org" <no-reply@medmee.org>', // sender address (who sends)
				to: data.email, // list of receivers (who receives)
				subject: 'Please confirm your Email account', // Subject line
				html: `<br>Please Click on the link to verify your email.<br><b>This will expire in 48 hours.</b><br><a href=${link}>Click here to verify</a>`, // html body
			};
			smtpTransport.sendMail(mailOptions, (error) => {
				if (error) {
					console.error('smtp error');
					return false;
				}
				return true;
			});
		} else {
			return response.status(400).send(httpResponses.onAlreadyVerified);
		}
	});
}

function confirmVerification(request, response) {
	try {
		const verifyUser = async () => {
			const status = await verifyUsers(request.params.tid);
			if (status !== 66 && status !== 99 && status) {
				return response.send({
					success: true,
					message: 'Verification Successful',
				});
			}
			if (status === 99) {
				return response.status(400).send({
					success: false,
					message: 'Something wrong with verification',
				});
			}
			if (status === 66) {
				return response.status(400).send({
					success: false,
					message: 'invalid token',
				});
			}
			if (status === 44) {
				return response.status(400).send({
					success: false,
					message: 'token expired',
				});
			}
			if (!status) {
				return response.status(400).send({
					success: false,
					message: 'something wrong',
				});
			}
		};
		verifyUser();
	} catch (e) {
		return response.status(400).send({
			success: false,
			message: 'Invalid Request parameters',
		});
	}
}

function sendVerificationEmail(uid) {
	User.findOne({
		_id: uid,
		isEmailVerified: false,
	}, (error, data) => {
		if (error) {
			return false;
		}
		if (data) {
			const vToken = generateToken();
			const link = `${host}/${vToken}`;
			const mailOptions = {
				from: '"no-reply@medmee.org" <no-reply@medmee.org>', // sender address (who sends)
				to: data.email, // list of receivers (who receives)
				subject: 'Please confirm your Email account', // Subject line
				html: `<br>Please Click on the link to verify your email.<br><b>This will expire in 48 hours.</b><br><a href=${link}>Click here to verify</a>`, // html body
			};
			smtpTransport.sendMail(mailOptions, (error) => {
				if (error) {
					return false;
				}
				User.updateOne({
					_id: uid,
				}, {
					$set: {
						'userToken.activationToken': vToken,
						'userToken.createdAt': Date.now(),
					},
				}, (error) => {
					if (error) {
						return false;
					}
					return true;
				});
			});
		} else {
			return false;
		}
	});
}

module.exports = {
	sendVerificationEmail,
	sendVerification,
	confirmVerification,
};