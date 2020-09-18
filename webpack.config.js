const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    target: "node",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
        // sourceMapFilename: "./[file].map[query]",
        // devtoolModuleFilenameTemplate: "./[file].map[query]",
        library: 'BehaviorTreeFlatBuffer',
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"],
        // alias: {
        //   'ape-ecs': path.resolve(__dirname, './node_modules/ape-ecs/src/index.js'),
        //   // 'ape-ecs/src/entity.js': './node_modules/ape-ecs/src/entity.js',
        // }
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
        ]
    },

    performance: {
      // hints: process.env.NODE_ENV === 'production' ? "warning" : false
      // hints: false,

    maxEntrypointSize: 1000000000, // set size limit warning to 100Mb
    maxAssetSize: 1000000000,      // set size limit warning to 100Mb
    },

    plugins: [
    new CopyPlugin({
      patterns: [
      { from: './out/*.wasm', to: '', flatten: true },
    ]}),
  ],
}
