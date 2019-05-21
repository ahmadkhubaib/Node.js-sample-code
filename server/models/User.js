const mongoose = require('mongoose');

const {
	Schema,
} = mongoose;
const bcrypt = require('bcrypt');


const oldDataSetSchema = new Schema({
	data: {
		type: String,
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
}, {
	_id: false,
});
module.exports = mongoose.model('oldDataSetSchema', oldDataSetSchema);

const oldDataSchema = new Schema({
	oldUsernames: [oldDataSetSchema],
	oldPasswords: [oldDataSetSchema],
	oldEmails: [oldDataSetSchema],
}, {
	_id: false,
});
module.exports = mongoose.model('oldDataSchema', oldDataSchema);

const userTokenSchema = new Schema({
	activationToken: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model('userTokenSchema', userTokenSchema);

const User = new Schema({
	username: {
		type: String,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true,

	},
	isEmailVerified: {
		type: Boolean,
		default: false,
	},
	uType: {
		type: Number,
		required: true,
	},
	isDisabled: {
		type: Boolean,
		default: false,
	},
	userToken: userTokenSchema,
	oldData: oldDataSchema,
	uData: {
		type: Schema.Types.ObjectId,
		required: true,
	},
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});


// eslint-disable-next-line consistent-return
// eslint-disable-next-line func-names
User.pre('save', function (next) {
	const thisUser = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(12, (err, salt) => {
			if (err) {
				return next(err);
			}
			bcrypt.hash(thisUser.password, salt, (err, hash) => {
				if (err) {
					return next(err);
				}
				thisUser.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

// eslint-disable-next-line func-names
User.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, (err, isMatch) => {
		if (err) {
			return cb(err);
		}
		return cb(null, isMatch);
	});
};


module.exports = mongoose.model('User', User);
