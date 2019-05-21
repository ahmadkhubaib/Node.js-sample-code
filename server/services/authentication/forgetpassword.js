const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
require('dotenv').config();
const Validator = require('validator');
const User = require('../../models/User');


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
	onEmailValidationError: {
		success: false,
		message: 'E-mail is required or invalid.',
	},
	onSuccess: {
		success: true,
		message: 'Reset link sent. Please check your inbox/spam folder.',
	},
	onUserDisabled: {
		success: false,
		message: 'User is Disabled.',
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
const host = 'https://athenium2-be.herokuapp.com/v1/forget/reset/';

function sendResetRequest(request, response) {
	const email = (`${request.body.email}`).trim();
	if (!Validator.isEmail(email)) {
		return response.status(400).send(httpResponses.onEmailValidationError);
	}

	User.findOne({
		email,
		// eslint-disable-next-line consistent-return
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
		if (!user.isDisabled && user) {
			const vToken = generateToken();
			const link = `${host}${vToken}`;
			const mailOptions = {
				from: '"no-reply@medmee.org" <no-reply@medmee.org>', // sender address (who sends)
				to: request.body.email, // list of receivers (who receives)
				subject: 'MedMee Password Reset', // Subject line
				html: `<br>Please Click on the link to reset your password.<br><b>This will expire in 48 hours.</b><br><a href=${link}>Click here to reset</a>`, // html body
			};
			smtpTransport.sendMail(mailOptions, (error) => {
				if (error) {
					return response.status(400).send(httpResponses.onEmailFailed);
				}
				User.updateOne({
					email: request.body.email,
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
			});
		}
	});
}

module.exports = {
	sendResetRequest,
};
