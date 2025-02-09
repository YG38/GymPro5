// config-overrides.js
const path = require('path');

module.exports = function override(config, env) {
  // Modify the Webpack configuration to add polyfills for the missing modules
  config.resolve.fallback = {
    url: require.resolve('url/'),
    buffer: require.resolve('buffer/'),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    util: require.resolve('util/'),
  };

  return config;
};
