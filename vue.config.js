const path = require("path");

// TODO set target to nginx port instead of the server

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        logLevel: "debug",
      },
    },
  },
  outputDir: path.resolve(__dirname, "./public"),
  // pwa: {
  //   workboxPluginMode: "InjectManifest",
  //   manifestCrossorigin: "anonymous",
  // },
};
