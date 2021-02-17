const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlPageNames = ['home', 'test'];

const entrys = {}
const multipleHtml = htmlPageNames.map(name => {
  entrys[name] = `./src/${name}/index.js`;
  return new HtmlWebpackPlugin({
    template: `src/${name}/index.htm`, // relative path to the HTML files
    filename: `${name}.htm`, // output HTML files,
    chunks: [name]
  })
});


module.exports = {
  entry: entrys,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    ...multipleHtml,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
