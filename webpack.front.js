const webpack = require("webpack"); //to access built-in plugins
var path = require("path");

const { NODE_ENV = "production", BASE_URL } = process.env;

var config = {
  entry: [path.resolve(__dirname, "client/app.tsx")],
  output: {
    path: path.resolve(__dirname, "public/build"),
    filename: "app.js",
    clean: true,
  },
  mode: NODE_ENV,
  devtool: "source-map",
  target: "web",
  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
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
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          BASE_URL: JSON.stringify(BASE_URL),
        },
      },
    }),
  ],
};
module.exports = config;
