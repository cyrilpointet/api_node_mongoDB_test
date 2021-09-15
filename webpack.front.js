var path = require('path');
var config = {
    entry: [path.resolve(__dirname, 'resources/js/app.js')],
    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        // eslint need to be on bottom as loaders are executed bottom-first
                        loader: "eslint-loader",
                    },
                ],
            },
        ]
    }
};
module.exports = config;
