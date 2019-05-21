/* eslint-disable quote-props */
const mongoose = require('mongoose');

const {
	Schema,
} = mongoose;

const PHARMACIST_ROLES = ['OWNER', 'PHARMACIST', 'ASSISTANT'];
const BIOMETRIC_TYPES = [0, 1, 2];

const BiometricsSchema = new Schema({
	documentType: {
		type: Number,
		enum: BIOMETRIC_TYPES,
	},
	pictures: {
		type: [String],
	},
});

module.exports = mongoose.model('BiometricsSchema', BiometricsSchema);

const WorkSchema = new Schema({
	Pid: {
		type: Schema.Types.ObjectId,
	},
	role: {
		type: String,
		enum: PHARMACIST_ROLES,
	},
}, {
	_id: false,
});

module.exports = mongoose.model('WorkSchema', WorkSchema);

const PharmacistSchema = new Schema({
	fname: {
		type: String,
	},
	lname: {
		type: String,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
	isConfirmed: {
		type: Boolean,
		default: false,
	},
	userImage: {
		type: [String],
	},
	DOB: {
		type: Date,
	},
	age: {
		type: Number,
		default: 0,
	},
	address: {
		type: [Schema.Types.ObjectId],
	},
	gender: {
		type: Number,
		default: 0,
	},
	email: {
		type: String,
		lowercase: true,
	},
	uType: {
		type: Number,
	},
	ownerOf: [Schema.Types.ObjectId],
	worksAt: [WorkSchema],
	identity: BiometricsSchema,
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('Pharmacist', PharmacistSchema);
