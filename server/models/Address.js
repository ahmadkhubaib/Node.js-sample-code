const mongoose = require('mongoose');

const { Schema } = mongoose;

const COUNTRIES = ['DE', 'FR', 'NL'];

const GeoDataSchema = new Schema({
	addLat: {
		type: String,
	},
	addLong: {
		type: String,
	},
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('GeoDataSchema', GeoDataSchema);

const AddressSchema = new Schema({
	addTypeUser: {
		type: Number,
	},
	addUser: {
		type: Schema.Types.ObjectId,
	},
	addConnectedTo: {
		type: Array,
	},
	country: {
		type: String,
		enum: COUNTRIES,
	},
	stateProvince: {
		type: String,
	},
	city: {
		type: String,
	},
	zipPost: {
		type: Number,
	},
	streetNo: {
		type: Number,
	},
	houseNo: {
		type: String,
	},
	addLine1: {
		type: String,
	},
	addLine2: {
		type: String,
	},
	addNameOnProp: {
		type: String,
	},
	additionalDescription: {
		type: String,
	},
	addressPhone: {
		type: Array,
	},
	isApproved: {
		type: Boolean,
	},
	geoData: GeoDataSchema,
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('Address', AddressSchema);
