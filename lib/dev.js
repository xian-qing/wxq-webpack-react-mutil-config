/**
 * Created by stone on 2017/6/10.
 */
let path = require("path")
let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let proxy = require('./proxy');

module.exports = {
    config(setting){
        //console.log(setting)
        var devName = setting.devName
        let srcDir = path.resolve(setting.projectPath, 'build')
        let webpackConfig = require('./config.js').config(setting)
        //console.log(webpackConfig)

        //开发模式要处理一下
        webpackConfig.devtool = 'source-map'
        var compiler = webpack(webpackConfig);
        let server = new WebpackDevServer(compiler, {
            publicPath: '/',
            contentBase: srcDir,
            inline: true,
            hot: true,
            proxy: proxy
        })
        server.listen(8080, "localhost", function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}
