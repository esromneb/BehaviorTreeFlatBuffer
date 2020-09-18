const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    target: "node",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
        library: 'BehaviorTreeFlatBuffer',
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
        ]
    },

    plugins: [
    new CopyPlugin({
      patterns: [
      { from: './out/*.wasm', to: '', flatten: true },
    ]}),
  ],
}
