const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = function (env, argv) {
  const { mode } = argv
  const isProduction = mode === 'production'
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '',
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        { test: /\.pug$/, loader: 'pug-loader' },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
        ...(isProduction
          ? [
              {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'image-webpack-loader',
                // Specify enforce: 'pre' to apply the loader
                // before url-loader/svg-url-loader
                // and not duplicate it in rules with them
                enforce: 'pre',
              },
            ]
          : []),
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: isProduction ? 'url-loader' : 'file-loader',
          options: {
            name: '[path][name].[ext]',
            esModule: false,
          },
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      open: false,
    },
    performance: {
      hints: false,
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-source-map',
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        template: './templates/index.pug',
        filename: 'index.html',
      }),
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
                safari10: true,
              },
              parallel: true,
            }),
            new CssMinimizerPlugin(),
          ],
        }
      : {},
  }
}
