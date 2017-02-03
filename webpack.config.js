'use strict';
const path = require('path');
const fs = require('fs');

function root(__path = '.') {
  return path.join(__dirname, __path);
}

module.exports = {
    entry: './src/main.ts',
    output: { filename: 'build/bundle.js' },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                }
            },
            {
                test: /\.json$/, loader: "json", include: "./src/"
            },
            { 
                test: /\.html$/,  loader: "raw-loader", include: "./src"
            }        
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx']
    },
    externals: {
        jquery: 'jQuery',
        leaflet: 'L'
    }
};