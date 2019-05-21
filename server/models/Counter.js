const mongoose = require('mongoose');

const {
	Schema,
} = mongoose;

const CounterSchema = Schema({
	_id: {
		type: String,
		required: true,
	},
	seq: {
		type: Number,
		default: 50000,
	},
});

module.exports = mongoose.model('Counter', CounterSchema);
