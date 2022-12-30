const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const base = require('./webpack.base.config');
const config = require('./env.config');

module.exports = merge(base, {
	mode: 'development',
	devServer: {
		open: true,
		historyApiFallback: true,
		server: 'https',
		static: {
			directory: path.join(__dirname, 'dist')
		}
	},

	plugins: [
		new webpack.DefinePlugin({
			process: {
				env: {
					API_URL: JSON.stringify(config.DEVELOPMENT.API_URL),
					IS_LOCAL: true
				}
			}
		})
	],
	devtool: 'eval-cheap-module-source-map' // To show console output from original file instead of showing from bundle file
});
