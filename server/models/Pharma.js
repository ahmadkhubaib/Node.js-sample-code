/* eslint-disable quote-props */
const mongoose = require('mongoose');

const {
	Schema,
} = mongoose;

const SUBSCRIPTION_TYPES = ['STARTER', 'BASIC', 'PRO', 'CUSTOM'];
const PAYMENT_GATEWAYS = ['PAYPAL', 'CREDIT_CARD'];
const PHARMACIST_ROLES = ['OWNER', 'PHARMACIST', 'ASSISTANT', 'PHARMACY_COURIER'];

const SubscriptionSchema = new Schema({
	subscriptionType: {
		type: String,
		enum: SUBSCRIPTION_TYPES,
	},
	startDate: {
		type: Date,
	},
	endDate: {
		// refresh after 4 weeks
		type: Date,
	},
	isExpired: {
		type: Boolean,
	},
	paymentMethod: {
		type: String,
		enum: PAYMENT_GATEWAYS,
	},

}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('SubscriptionSchema', SubscriptionSchema);

const MerchantDetailsSchema = new Schema({
	provider: {
		type: String,
	},
	merchantID: {
		type: String,
	},
	tos_acceptance: {
		type: Date,
	},
}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('MerchantDetailsSchema', MerchantDetailsSchema);

const ReceivedOrdersSchema = new Schema({
	orderedBy: {
		type: mongoose.Schema.Types.ObjectId,
	},
	orderID: {
		type: Number,
	},
	isAccepted: {
		type: Boolean,
		default: false,
	},
}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('ReceivedOrdersSchema', ReceivedOrdersSchema);

const ProductSchema = new Schema({
	productName: {
		type: String,
	},
	productQuantity: {
		type: Number,
	},
	form: {
		type: String,
	},
	amount: {
		type: String,
	},
	price: {
		type: Number,
	},
}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('ProductSchema', ProductSchema);

const SubUsersSchema = new Schema({
	role: {
		type: String,
		enum: PHARMACIST_ROLES,
	},
	Uid: {
		type: Schema.Types.ObjectId,
	},
	fname: {
		type: String,
	},
	lname: {
		type: String,
	},
}, {
	_id: false,
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('SubUsersSchema', SubUsersSchema);

// const ProductSchema = new Schema({
// 	productID: {
// 		type: mongoose.Schema.Types.ObjectId,
// 	},
// 	productQuantity: {
// 		type: Number,
// 	},
// }, {
// 	timestamps: {
// 		createdAt: 'createdAt',
// 		updatedAt: 'updatedAt',
// 	},
// });

// module.exports = mongoose.model('ProductSchema', ProductSchema);

const PharmaSchema = new Schema({
	pharmaName: {
		type: String,
	},
	licence: {
		type: String,
	},
	address: {
		type: [Schema.Types.ObjectId],
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
	isConfirmed: {
		type: Boolean,
		default: false,
	},
	isStoreAllowed: {
		type: Boolean,
		default: false,
	},
	isPromotionAllowed: {
		type: Boolean,
		default: false,
	},
	chatWelcomeMessage: {
		type: String,
		default: 'This is beginning of your conversation with your pharmacy. If you have any questions or notes, please leave them here so the pharmacy can assist you better.',

	},
	externalChatMessage: {
		type: String,
		default: 'Thank you for your message. We will get back to you.',
	},
	pharmacyUrl: {
		type: String,
	},
	website: {
		type: String,
	},
	licenceNumber: {
		type: Number,
	},
	openingDays: {
		'1': {
			openingTime: Number,
			closingTime: Number,
		},
		'2': {
			openingTime: Number,
			closingTime: Number,
		},
		'3': {
			openingTime: Number,
			closingTime: Number,
		},
		'4': {
			openingTime: Number,
			closingTime: Number,
		},
		'5': {
			openingTime: Number,
			closingTime: Number,
		},
		'6': {
			openingTime: Number,
			closingTime: Number,
		},
		'7': {
			openingTime: Number,
			closingTime: Number,
		},
	},
	pharmacyImage: {
		type: String,
	},
	merchantID: {
		type: String,
	},
	receivedOrders: {
		type: [ReceivedOrdersSchema],
	},
	// products: {
	// 	type: [ProductSchema],
	// },
	totalRatings: {
		upVotes: {
			type: Number,
		},
		downVotes: {
			type: Number,
		},
		favorites: {
			type: Number,
		},
	},

	products: {
		type: [ProductSchema],
	},
	externalChats: {
		type: [Schema.Types.ObjectId],
	},
	subscription: SubscriptionSchema,
	users: [SubUsersSchema],
	merchantdetails: [MerchantDetailsSchema],
}, {
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
});

module.exports = mongoose.model('Pharma', PharmaSchema);