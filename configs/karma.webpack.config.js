'use strict';

const NODE_ENV = global.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');

const config = {

	devtool: (NODE_ENV === 'development') ? 'inline-source-map' : null,

	module: {
	    loaders: [{
	      test: /\.js$/,
	      exclude: [`${__dirname}/node_modules`],
	      loader: 'babel',
	    }],
	}
};

module.exports = config;
