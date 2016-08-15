'use strict';

const config = require('./karma.webpack.config');
const NODE_ENV = global.NODE_ENV;

const webpack = require('webpack');
const path = require('path');

let outputDir = '../build';

if (NODE_ENV === 'deploy') {
	outputDir = '../dist';
}

config.entry = './src/index.js';
  
config.output = {
	path: path.join(__dirname, outputDir),
	publicPath: './',
	filename: 'wave_finder.js',
	library: 'wavefinder'
};

if (NODE_ENV === 'production' || NODE_ENV === 'deploy') {
	config.devtool = 'source-map';

	if (typeof config.plugins === 'undefined') {
		config.plugins = [];
	}

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
    })
  );
}

module.exports = config;
