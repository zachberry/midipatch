var ExtractTextPlugin = require('extract-text-webpack-plugin');

let mainConfig = {
	entry: './src/components/index.jsx',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/build',
		publicPath: '/assets/'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: 'css-loader!sass-loader'
				})
			}
		]
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'style.css',
			allChunks: true
		})
	],
	resolve: {
		extensions: ['.js', '.jsx']
	}
}

module.exports = [mainConfig];