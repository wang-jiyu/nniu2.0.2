/*
 hainniu
 */
var Webpack = require('webpack');
var CommonsPlugin = new Webpack.optimize.CommonsChunkPlugin('common');
var ProvidePlugin = new Webpack.ProvidePlugin({
    $: 'jquery',
    React: 'react',
    Echarts: 'echarts',
    CryptoJS: 'crypto-js',
    Utils: __dirname + '/commonTool/utils',
    Config: __dirname + '/commonTool/config',
    Forms: __dirname + '/commonTool/forms',
    Event: __dirname + '/commonTool/event',
    Url: __dirname + '/commonTool/site_url',
    Load: __dirname + '/commonTool/load',
    ArrayCollection: __dirname + '/commonTool/array-collection',
    Interface: __dirname + '/commonTool/interface',
    Vip: __dirname + '/commonTool/vip',
});
var DefinePlugin = new Webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': '"production"'
    }
});

module.exports = {
    entry: {
        usercenter: './application/modules/usercenter/Index.js',
        news: './application/modules/news/Index.js',
        live: './application/modules/live/Index.js',
        message: './application/modules/message/Index.js',
        tool: './application/modules/tool/Index.js',
        jewel: './application/modules/jewel/Index.js',
        classroom: './application/modules/classroom/Index.js',
        strategy_index: './application/modules/strategy/index/Index.js',
        strategy_problem: './application/modules/strategy/problem/Index.js',
        strategy_order: './application/modules/strategy/order/Index.js',
        strategy_info_no_subscription: './application/modules/strategy/info/noSubscription/Index.js',
        myYesSubscribeStrategy: './application/modules/strategy/myYesSubscribeStrategy/Index.js'
    },
    output: {
        path: __dirname + '/release/assets/',
        publicPath: '/assets/',
        filename: 'scripts/taro.[name].js',
        chunkFilename: 'scripts/taro.[name].js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jsx-loader'
        }, {
            test: /\.(woff|woff2|eot|svg|ttf)$/,
            loader: "url-loader"
        }, {
            test: /\.(png|jpg|gif|jpeg)$/,
            loader: "url-loader"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },
    plugins: [
        CommonsPlugin,
        ProvidePlugin,
        DefinePlugin
    ]
}