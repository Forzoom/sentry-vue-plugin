const path = require('path');
const webpack = require('webpack')

process.env.NODE_ENV = 'production'; // 对于vue-loader代码有效

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'sentry-vue-plugin.min.js',
		library: 'sentry-vue-plugin',
		libraryTarget: 'umd',
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
		},
	},
	externals: {
		vue: 'vue',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [path.resolve(__dirname, '../src')]
			},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'), // 对于src代码有效
	    }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
	],
	watch: true,
}	