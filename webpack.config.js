var BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');

module.exports = {
    entry: "./src/typings/app.ts",
    output: {
        path: '/',
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
        ]
    },
    externals: {
        Canvas: './src/typings/power-draw/Canvas.ts',
        Selection: './src/typings/power-draw/Selection.ts'
    },
    plugins: [
        new BrotliGzipPlugin({
            asset: '[path].br[query]',
            algorithm: 'brotli',
            test: /\.(ts|js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            quality: 11
        }),
        new BrotliGzipPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(ts|js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
}
