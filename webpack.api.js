const path = require("path");
// this package handles all the external packages
const nodeExternals = require("webpack-node-externals");
// help running shell commands with webpack before and after the build process
const WebpackShellPlugin = require("webpack-shell-plugin-next");
// used to do the typechecking in a seperate process so the transpiling will be handled only by tsloader.
// speed up compilation of code
//const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { NODE_ENV = "production" } = process.env;

module.exports = {
  // our entry server file
  entry: {
    main: "./server/www.js",
    seeder: "./seed/seeder.js",
    populateDb: "./populateDb/populateDb.ts",
  },
  // should be here so webpack knows that it handles node packages
  target: "node",
  // mode can be production or development
  mode: NODE_ENV,
  devtool: "source-map",
  externals: [nodeExternals()],
  // output path, i chose build but feel free to change it to anything
  // output file name [name]. means that it will create multiple code chunks for the build
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
    clean: true,
  },
  // all file extensions to resolve, we might need to add file and images extensions if needed
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    //new ForkTsCheckerWebpackPlugin(),
    new WebpackShellPlugin({
      // when build ends run dev if the environment is development else run prod
      onBuildEnd:
        NODE_ENV === "development" ? ["yarn run:dev"] : ["yarn run:prod"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "file-loader",
      },
      {
        // Transpiles ES6-8 into ES5
        test: /\.(js|ts)$/,
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
