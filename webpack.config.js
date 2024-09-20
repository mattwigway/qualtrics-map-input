const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      ],
    },
    plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin()],
    output: {
        library: "QualtricsMapInput"
    },
    devServer: {
        host: '127.0.0.1'
    }
  };