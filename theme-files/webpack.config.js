var path = require("path");
var webpack = require("webpack");
var publicPath = "/src/js/main/components/";
var hash =
    Math.random()
        .toString(36)
        .substring(2, 15) +
    Math.random()
        .toString(36)
        .substring(2, 15) +
    Math.random()
        .toString(36)
        .substring(2, 15) +
    Math.random()
        .toString(36)
        .substring(2, 15);

module.exports = {
    entry: "./src/js/components/script.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "/js"),
        chunkFilename: hash + ".[id].script.chunk.js",
        publicPath: publicPath
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: "babel-loader"
            },
            {
                test: /\.json$/,
                use: "json"
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    devtool: "source-map"
};
