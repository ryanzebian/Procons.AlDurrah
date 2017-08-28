var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
const path = require('path');

commonConfig.plugins = [       new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' })
];
module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    devServer: {
        open: true,
        watchContentBase: true,
        publicPath: "/dist/",
        historyApiFallback: true
    },
    plugins: [
        //new webpack.NoEmitOnErrorsPlugin(),
        //new webpack.optimize.UglifyJsPlugin({ 
        //    mangle: {
        //        keep_fnames: true
        //    }
        //}),
        new ExtractTextPlugin('[name].css'),
        //new webpack.DefinePlugin({
        //    'process.env': {
        //        'ENV': JSON.stringify(ENV)
        //    }
        //}),
        //new webpack.LoaderOptionsPlugin({
        //    htmlLoader: {
        //        minimize: false // workaround for ng2
        //    }
        //})
    ]
});