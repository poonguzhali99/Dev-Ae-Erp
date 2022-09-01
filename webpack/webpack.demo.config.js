const { merge } = require("webpack-merge");
const webpack = require("webpack");
const base = require("./webpack.base.config");
const Visualizer = require("webpack-visualizer-plugin2");
const config = require("./env.config");

module.exports = merge(base, {
  mode: "production",
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new Visualizer({
      filename: "./statistics.html", // statistics.html will view the bundle.js usages.
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          API_URL: JSON.stringify(config.DEMO.API_URL),
          SOCKET_URL: JSON.stringify(config.DEMO.SOCKET_URL),
          APP_ID: JSON.stringify(config.DEMO.APP_ID),
          STRIPE_CLIENT_ID: JSON.stringify(config.DEMO.STRIPE_CLIENT_ID),
          STRIPE_PUBLISHABLE_KEY: JSON.stringify(
            config.DEMO.STRIPE_PUBLISHABLE_KEY
          ),
        },
      },
    }),
  ],
});
