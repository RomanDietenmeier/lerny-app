const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'web',
    entry: {
        app: './src/index.tsx',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    output: {
        globalObject: 'self',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "./",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html'
        }),
    ].filter(Boolean)
};