module.exports = {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "querystring": require.resolve("querystring-es3"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "zlib": require.resolve("browserify-zlib"),
        "fs": false, // To ignore 'fs' module as it's not needed for the browser
        "net": false, // To ignore 'net' module
      }
    },
    // Other webpack configuration...
  };
  