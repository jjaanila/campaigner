const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const markerExists = directory => ['.git', '.hg'].some(mark => fs.existsSync(path.join(directory, mark)))

/**
 * Simple version of `find-project-root`
 * https://github.com/kirstein/find-project-root/blob/master/index.js
 */
const findProjectRoot = directory => {
  while (!markerExists(directory)) {
    const parentDirectory = path.resolve(directory, '..')
    if (parentDirectory === directory) {
      break
    }
    directory = parentDirectory
  }

  return directory
}

module.exports = function (env, argv) {
  const { mode } = argv
  const projectRoot = findProjectRoot(__dirname)
  const campaign = require(path.join(projectRoot, 'campaign.js'))
  if (typeof campaign.entry !== 'string' && !campaign.entry.length) {
    throw new Error('campaign.entry is not defined')
  }
  const isProduction = mode === 'production'
  return {
    entry: {
      main: path.join(projectRoot, campaign.entry),
      player: './src/player/index.js',
    },
    output: {
      path: path.join(projectRoot, 'dist'),
      publicPath: '',
    },
    resolve: {
      alias: {
        'project-root': projectRoot,
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
        title: campaign.title,
        template: './templates/index.pug',
        filename: 'player.html',
        chunks: ['player'],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        cache: false,
        title: campaign.title,
        template: './templates/index.pug',
        filename: 'index.html',
        chunks: ['main'],
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
