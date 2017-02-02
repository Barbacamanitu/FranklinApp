'use strict';

module.exports = {
    entry: './src/main.ts',
    output: { filename: 'build/bundle.js' },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx' ]
    },
    externals: {
    }
};