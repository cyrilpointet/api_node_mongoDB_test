var path = require("path");

const { NODE_ENV = "production" } = process.env;

var config = {
  entry: [path.resolve(__dirname, "resources/app.tsx")],
  output: {
    path: path.resolve(__dirname, "public/build"),
    filename: "app.js",
    clean: true,
  },
  mode: NODE_ENV,
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
};
module.exports = config;
