const _ = require('lodash');

let env = '';
if (process.env.NODE_ENV === 'test') {
	env = 'test-env';
} else {
	env = process.env.NODE_ENV || 'local';
}

const envConfig = require('./' + env);

const defaultConfig = {
	env,
};

module.exports = _.merge(defaultConfig, envConfig);
