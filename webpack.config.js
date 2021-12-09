const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const svgToMiniDataURI = require('mini-svg-data-uri');

const htmlPageNames = fs.readdirSync('./src');

const entrys = {}
const multipleHtml = htmlPageNames.map(name => {
  entrys[name] = `./src/${name}/index.js`;
  return new HtmlWebpackPlugin({
    template: `src/${name}/index.htm`,
    filename: `${name}.htm`,
    chunks: [name]
  })
});


module.exports = {
  entry: entrys,
  output: {
    filename: 'assets/js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.htm(l)?$/,
        loader: 'html-loader',
        options: {
          preprocessor: (content, loaderContext) => {
            let result;

            try {
              const aliasObj = loaderContext._compiler.options.resolve.alias;
              result = content;
              for (var aliasKey in aliasObj) {
                var re = new RegExp(aliasKey, 'g');
                result = result.replace(re, aliasObj[aliasKey]);
              }
            } catch (error) {
              loaderContext.emitError(error);

              return content;
            }

            return result;
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              outputPath: 'assets/images',
              esModule: false,
            }
          },
        ],
      },
      {
        test: /\.svg$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              generator: (content) => svgToMiniDataURI(content.toString())
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  },
  plugins: [
    ...multipleHtml,
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
      chunkFilename: '[id].css'
    })
  ],
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'images'),
    }
  }
};
