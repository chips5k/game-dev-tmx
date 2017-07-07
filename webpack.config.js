var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack-loader'
                ]
            },
            { test: /\.(xml|tmx)$/, loader: 'xml-loader' }
        ]
    }
};