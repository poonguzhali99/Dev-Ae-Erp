const { merge } = require('webpack-merge');
const webpack = require('webpack');
const base = require('./webpack.base.config');
const config = require('./env.config');

module.exports = merge(base, {
	mode: 'development',
	devServer: {
		open: true,
		// inline: true,
		historyApiFallback: true,
		// https: true,
		server: 'https'
	},
	plugins: [
		new webpack.DefinePlugin({
			process: {
				env: {
					API_URL: JSON.stringify(config.DEVELOPMENT.API_URL),
					SOCKET_URL: JSON.stringify(config.DEVELOPMENT.SOCKET_URL),
					APP_ID: JSON.stringify(config.DEVELOPMENT.APP_ID),
					IS_LOCAL: true,
					STRIPE_CLIENT_ID: JSON.stringify(config.DEVELOPMENT.STRIPE_CLIENT_ID),
					STRIPE_PUBLISHABLE_KEY: JSON.stringify(config.DEVELOPMENT.STRIPE_PUBLISHABLE_KEY)
				}
			}
		})
	],
	devtool: 'eval-cheap-module-source-map' // To show console output from original file instead of showing from bundle file
});
