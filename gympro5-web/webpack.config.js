module.exports = {
    resolve: {
      fallback: {
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "fs": false,  // Not needed in the browser
        "http": false,  // Not needed in the browser
        "net": false  // Not needed in the browser
      }
    }
  };
  