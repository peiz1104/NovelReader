const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
const commonCssLoader = process.env.NODE_ENV === 'production' ? [
  { loader: require.resolve('css-loader') },
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        autoprefixer({
          overrideBrowserslist: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9' // React doesn't support IE8 anyway
          ],
          flexbox: 'no-2009'
        })
      ]
    }
  }
] : ['style-loader', 'css-loader'];
module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'novelReader.js',
    // __dirname node.js变量 当前文件的绝对路径
    path: resolveApp('dist')
  },
  // loader配置
  module: {
    // 详细loader配置
    rules: [
      {
        test: /\.css$/,//匹配文件
        // MiniCssExtractPlugin.loader（link 引入样式） 代替style.loader(插入到head)
        use: [...commonCssLoader]
      },
      {
        test: /\.(jeg|jpeg|png|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100 * 1024,
          name: '[name].[hash:8].[ext]',
          outputPath: 'static/media'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        exclude: '/(node_modules)/',
        options: {
          presets: [[
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: { version: 3 },
              targets: {
                chrome: '40',
                firefox: '30',
                ie: '9',
                safari: '10',
                edge: '10'
              }
            }
          ]],
          cacheDirectory: true
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({ clientsClaim: true, skipWaiting: true })
  ],
  performance: false
}