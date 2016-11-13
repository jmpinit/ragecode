const nodeExternals = require('webpack-node-externals');

module.exports = [
    {
        name: 'main',
        entry: './src/index.js',
        target: 'node',
        externals: [nodeExternals()],
        devtool: 'source-map',
        output: {
            path: __dirname,
            filename: 'build/lib.js',
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /ragecode\/node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015'],
                    },
                },
            ],
        },
    },
];

