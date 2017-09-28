
var path = require('path');
var webpack = require('webpack');
var debug = process.env.NODE_ENV !== "production";

module.exports = {
    entry: {
        appBundle: ['./src/app.js']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        loaders: [
          {
              test: /.jsx?$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              query: {
                  presets: ['es2015', 'react', 'stage-2']
              }
          }, {
              test: /\.scss$/,
              loader: 'webpack-sass',
              exclude: /node_modules/
          }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
    },
    plugins: debug ? [] : [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};
