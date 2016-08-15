const webpackConfig = require('./karma.webpack.config');

module.exports = config => {
  config.set({

    basePath: '',

    coverageReporter: {
      dir: 'tmp/coverage/',
      reporters: [{
        type: 'text',
      }, {
        type: 'html',
        subdir: './'
      }]
    },

    frameworks: [
      'mocha',
      'chai',
    ],

    files: [
      'test/**/*.js',
    ],

    exclude: [],

    preprocessors: {
      'src/**/*.js': ['coverage'],
      'test/**/*.js': ['webpack', 'eslint']
    },

    reporters: ['mocha', 'coverage'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity,

    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-eslint',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-coverage',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-chrome-launcher'
    ],

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },

    eslint: {
      stopOnError: false,
      stopOnWarning: false,
      showWarnings: true,
      engine: {
        configFile: '.eslintrc.json'
      }
    }
  });
};
