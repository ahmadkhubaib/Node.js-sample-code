const mongoose = require('mongoose');

const {
	Schema,
} = mongoose;

const UserInsuranceSchema = new Schema({
	name: {
		type: String,
	},
	insuranceType: {
		type: Number,
	},
	memberSince: {
		type: Date,
	},
	insurancePackage: {
		type: String,
	},
	insuranceNumber: {
		type: String,
	},
	insuranceIdentifier: {
		type: Schema.Types.ObjectId,
	},
});

module.exports = mongoose.model('UserInsuranceSchema', UserInsuranceSchema);

const UsersMedicineSchema = new Schema({
	orderID: {
		type: Number,
	},
}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('UsersMedicineSchema', UsersMedicineSchema);

const PatientIndicatorsSchema = new Schema({
	allergy: {
		type: [String],
	},
	postponedDiseases: {
		type: [String],
	},
	currentMedications: {
		type: [String],
	},
	transferredSurgeries: {
		type: [String],
	},
	features: {
		type: [String],
	},
	additionalInfo: [{
		key: {
			type: String,
		},
		value: {
			type: [String],
		},
	}, {
		_id: false,
	}],
}, {
	_id: false,
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('PatientIndicatorsSchema', PatientIndicatorsSchema);


const RatingSchema = new Schema({
	voteType: {
		type: Number,
	},
	pharmacyID: {
		type: Schema.Types.ObjectId,
	},
	body: {
		type: String,
		default: '',
	},
}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('RatingSchema', RatingSchema);

const PatientSchema = new Schema({
	fname: {
		type: String,
	},
	lname: {
		type: String,
		default: '',
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
	roles: {
		type: String,
		default: 'user',
	},
	userImage: {
		type: [String],
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
	url: {
		type: String,
	},
	email: {
		type: String,
		lowercase: true,
	},
	uType: {
		type: Number,
	},
	defaultPharmacy: {
		type: Schema.Types.ObjectId,
	},
	externalChats: [Schema.Types.ObjectId],
	ratings: [RatingSchema],
	favoritePharmacies: [Schema.Types.ObjectId],
	userMedicines: [UsersMedicineSchema],
	patientIndicators: PatientIndicatorsSchema,
	PatientInsurance: [UserInsuranceSchema],
	familyMembers: [{
		name: {
			type: String,
		},
		relation: {
			type: String,
		},
		age: {
			type: Number,
		},
		indicators: PatientIndicatorsSchema,
	}, {
		_id: false,
	}],
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('Patient', PatientSchema);
