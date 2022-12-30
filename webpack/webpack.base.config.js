const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		app: './main.js'
	},
	plugins: [
		new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [ 'dist/*' ] }),
		new HtmlWebpackPlugin({
			template: 'index.html',
			favicon: 'fav.png' //Specify the path of the favicon here
		})
	],
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].[chunkhash].js',
		clean: true,
		assetModuleFilename: 'images/[hash][ext][query]'
	},

	module: {
		rules: [
			{
				test: /\.(jpe?g|png|gif|svg|woff|woff2|ttf|eot|otf|mp3|jpg|webp)/,
				type: 'asset/resource'
			},
			{
				test: /\.jsx?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'jsx', // Remove this if you're not using JSX
					target: 'es2018' // Syntax to compile to (see options below for possible values)
				}
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: 'style-loader' // creates style nodes from JS strings
					},
					{
						loader: 'css-loader' // translates CSS into CommonJS
					},
					{
						loader: 'sass-loader' // compiles Sass to CSS
					},
					{
						loader: 'sass-resources-loader', // Color globalization loader
						options: {
							resources: [ path.resolve(__dirname, '../src/assets/common_styles/const.scss') ]
						}
					}
				]
			}
		]
	},
	resolve: {
		modules: [ path.resolve(__dirname, '../src'), 'node_modules' ], // used to make use of absolute import
		extensions: [ '*', '.js', '.jsx', '.json' ]
	}
};
