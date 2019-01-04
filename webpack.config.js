const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const devPlugins = [
  new HTMLWebpackPlugin({
    template: 'src/index.html'
  })
]

const plugins = [
  ...devPlugins,
  // new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' }])
];


const ASSET_PATH = '/public'

module.exports = {
  entry: "./src/main.ts",
  mode: 'development',
  optimization: {
    minimize: true
  },
  devServer: {
    contentBase: './src'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};