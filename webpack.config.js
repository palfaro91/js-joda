const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const minify = JSON.parse(process.env.DIST_MIN || '0');
const sourceMaps = !minify;

function createBanner(){
    const packageJson = require('./package.json');
    const version = '//! @version ' + packageJson.name + ' - ' + packageJson.version + '\n';
    const preamble = fs.readFileSync('./src/license-preamble.js', 'utf8');
    return version + preamble;
}

const banner = createBanner();

module.exports = {
    context: __dirname,
    entry: './src/js-joda.js',
    devtool: sourceMaps ? 'hidden-source-map' : '',
    output: {
        path: __dirname  + '/dist',
        filename: minify ? 'js-joda.min.js' : 'js-joda.js',
        libraryTarget: minify ? 'var' : 'umd',
        library: 'JSJoda'
    },
    module: {
        rules: [{
            use: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test')
            ],
            test: /.js$/
        }]
    },
    plugins: minify ? [
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.BannerPlugin(
            {banner: banner, raw: true}
        )
    ] : [
        new webpack.BannerPlugin(
            {banner: banner, raw: true}
        )
    ]
};
