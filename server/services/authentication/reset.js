const bcrypt = require('bcrypt');
const User = require('../../models/User');

const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;

const httpResponses = {
	onPasswordValidationError: {
		success: false,
		message: 'Password is required or invalid.',
	},
	onUnexpectedError: {
		success: false,
		message: 'Unexpected error occured while resetting password.',
	},
	onUserNotFound: {
		success: false,
		message: 'No user found.',
	},
	onInvalidToken: {
		success: false,
		message: 'Reset Token is not valid/expired.',
	},
	onSuccess: {
		success: true,
		message: 'Password changed successfully.',
	},
	onCorrectToken: {
		success: true,
		message: 'Token is valid.',
	},
	onIncompleteParameters: {
		success: false,
		message: 'Parameters are incomplete.',
	},
};

function resetTokenVerification(request, response) {
	if (!request.params.resetToken) {
		return response.status(400).send(httpResponses.onIncompleteParameters);
	}
	User.findOne({
		'userToken.activationToken': request.params.resetToken,
	}, (error, userData) => {
		if (error) {
			return response.status(400).send(httpResponses.onUnexpectedError);
		}
		if (userData) {
			const currentMillis = Date.now();
			const registrationTime = Date.parse(userData.userToken.createdAt);
			const difference = currentMillis - registrationTime;
			const currentminutes = Math.round(difference / 1000 / 60);
			if (currentminutes < 1440) {
				return response.send(httpResponses.onCorrectToken);
			}
			return response.status(400).send(httpResponses.onInvalidToken);
		}
		if (!userData) {
			return response.status(400).send(httpResponses.onInvalidToken);
		}
	});
}

function updatePassword(request, response) {
	if (!request.params.resetToken || !request.body.password) {
		return response.status(400).send(httpResponses.onIncompleteParameters);
	}
	if (!password_regex.test(request.body.password)) {
		return response.status(400).send(httpResponses.onPasswordValidationError);
	}
	User.findOne({
		'userToken.activationToken': request.params.resetToken,
	}, (error, userData) => {
		if (error) {
			return response.status(400).send(httpResponses.onUnexpectedError);
		}
		if (userData) {
			const previousPassword = userData.oldData.oldPasswords.concat([{
				data: userData.password,
			}]);
			bcrypt.genSalt(12, (err, salt) => {
				if (err) {
					return response.status(400).send(httpResponses.onUnexpectedError);
				}
				bcrypt.hash(request.body.password, salt, (err, hash) => {
					if (err) {
						return response.status(400).send(httpResponses.onUnexpectedError);
					}
					if (hash) {
						User.updateOne({
							'userToken.activationToken': request.params.resetToken,
						}, {
							$set: {
								'userToken.activationToken': '',
								password: hash,
								'oldData.oldPasswords': previousPassword,
							},
						}, (error, raw) => {
							if (error) {
								return response.status(400).send(httpResponses.onUnexpectedError);
							}
							if (raw.nModified === 1 && raw.n === 1 && raw.ok === 1) {
								return response.send(httpResponses.onSuccess);
							}
							if (raw.nModified === 0 && raw.n === 0 && raw.ok === 0) {
								return response.status(400).send(httpResponses.onUnexpectedError);
							}
						});
					}
				});
			});
		}
		if (!userData) {
			return response.status(400).send(httpResponses.onUserNotFound);
		}
	});
}


module.exports = {
	resetTokenVerification,
	updatePassword,
};
