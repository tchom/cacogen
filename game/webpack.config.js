const path = require("path");

var config = {
    // TODO: Add common Configuration
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
        hot: true,
        overlay: true,
        inline: true,
        open: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
};

var gameOutputConfig = Object.assign({}, config, {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "main.js"
    },

});

module.exports = [gameOutputConfig];