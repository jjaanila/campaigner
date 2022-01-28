const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = function(env, argv) {
  const { mode } = argv;
  const isProduction = mode === "production";
  return {
    entry: "./src/main.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      publicPath: ""
    },
    module: {
      rules: [
        { test: /\.pug$/, loader: "pug-loader" },
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader"]
        },
        {
          test: /\.scss$/,
          use: ["vue-style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.sass$/,
          use: ["vue-style-loader", "css-loader", "sass-loader?indentedSyntax"]
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: {
            loaders: {
              // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
              // the "scss" and "sass" values for the lang attribute to the right configs here.
              // other preprocessors should work out of the box, no loader config like this necessary.
              scss: ["vue-style-loader", "css-loader", "sass-loader"],
              sass: [
                "vue-style-loader",
                "css-loader",
                "sass-loader?indentedSyntax"
              ]
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]?[hash]"
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js"
      },
      extensions: ["*", ".js", ".vue", ".json"]
    },
    devServer: {
      historyApiFallback: true,
      hot: true
    },
    performance: {
      hints: false
    },
    devtool: isProduction ? "source-map" : "eval-cheap-source-map",
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        template: "./templates/index.pug",
        filename: "index.html",
        title: "inline"
      })
    ],
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: { warnings: true, comparisons: false },
                mangle: { safari10: true },
                output: { ascii_only: true },
                safari10: true
              },
              parallel: true
            }),
            new CssMinimizerPlugin()
          ]
        }
      : {}
  };
};
