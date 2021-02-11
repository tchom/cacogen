const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const configuration = require('./config.json');

configuration.browsers = configuration.browsers || "> 1%";

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].build.js'
    },
    plugins: [
        new UglifyJsPlugin({ sourceMap: true })
    ],
    devtool: 'source-map'
};

