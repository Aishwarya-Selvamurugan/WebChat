const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        contentScript: path.resolve('./src/contentScript/App.jsx'),
        contentScript: path.resolve('./src/contentScript/Chatbot.jsx'),
        popup: path.resolve('./src/popup/popup.js'),
        background : path.resolve('./src/background/background.js'),
        contentScript: path.resolve('./src/contentScript/contentScript.js')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Match .js and .jsx files
                exclude: /node_modules/, // Exclude node_modules directory
                use: {
                    loader: "babel-loader", // Use Babel loader
                    options: {
                        presets: [
                            "@babel/preset-env", // Transpile modern JavaScript
                            "@babel/preset-react", // Transpile JSX
                        ],
                        plugins: [
                            "babel-plugin-styled-components", // Add styled-components plugin
                        ],
                    },
                },
                
            },
            {
                test: /\.css$/, // Match .css files
                use: [MiniCssExtractPlugin.loader, 'css-loader'], // Extract CSS into separate files
            },
        ],
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: path.resolve('src/assets/manifest.json'), to: path.resolve('dist') },
            { from: path.resolve('src/assets/icon.png'), to: path.resolve('dist') },
          ],
        }),
        new HtmlPlugin({
            title: "Web chatter",
            filename: 'popup.html',
            chunks : ['popup']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css', // Output CSS files with the same name as entry points
        }),
      ],
    output: {
        filename: '[name].js',
        path: __dirname + "/dist", // Specify output directory
    },
    resolve: {
        extensions: [".js", ".jsx"], // Resolve .js and .jsx files automatically
    },
};
