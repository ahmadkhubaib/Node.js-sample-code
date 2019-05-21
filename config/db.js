require('dotenv').config();

module.exports = {
	secret: process.env.PASSPORT_SECRET,
	database: process.env.ATHENIUM_URI,
};
