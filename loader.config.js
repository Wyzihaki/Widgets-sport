const path = require('path');
const { NoEmitOnErrorsPlugin, EnvironmentPlugin } = require('webpack');

const current_mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
    entry: {
        main: './src/loader.ts'
    },
    mode: 'production',
    module: {
        rules: [
            {
                "test": /\.ts$/,
                "loader": "ts-loader",
                options: {
                    compilerOptions: {
                        noEmit: false
                    }
                }
            }
        ]
    },
    output: {
        path: path.join(process.cwd(), "public"),
        filename: "loader.js",
        crossOriginLoading: false
    },
    plugins: [
        new NoEmitOnErrorsPlugin(),
        new EnvironmentPlugin({
            "NODE_ENV": "production"
        })
    ],
    resolve: {
        extensions: ['.ts', '.json', '.wasm'],
    },
};
