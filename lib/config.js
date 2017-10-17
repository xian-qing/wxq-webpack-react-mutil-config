/**
 * Created by stone on 2017/6/10.
 */
let path = require("path")
let glob = require('glob')
let webpack = require("webpack")
let HtmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let fs = require('fs')
let CopyWebpackPlugin = require('copy-webpack-plugin');
//主要配置信息
let config = {}
module.exports = {
    config(setting) {
        let me = this
        me.setting = setting   //自定义设置项
        //me.setting.devDir = 'jgg'
        me.entry(me.setting.devDir)
        me.output(me.setting.devDir)
        me.plugins(me.setting.devDir)
        me.module()
        me.externals()
        //console.log(config)
        return config
    },
    entry(devDirName) {
        let me = this
        config.entry = {}
        /*config.entry.aaa = '12312323'
        config.entry.outPut =  me.setting.outPut
        config.entry.projectPath = me.setting.projectPath*/

        //得到所有路径文件名
        var entryFiles = glob.sync(me.setting.projectPath + '/src/*/index.js')
        entryFiles.forEach((dirPath)=>{
            let filePathArr = dirPath.split('\/')
            let filename = filePathArr[filePathArr.length - 2]

            if(devDirName){
                if(devDirName == filename){
                    config.entry[filename] = [dirPath];
                    //单文件开发模式,开发加上dev-server
                    config.entry[filename].push("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server")
                }else if(devDirName == 'all'){
                    config.entry[filename] = [dirPath];
                }
            }else {
                //编译模式
                config.entry[filename] = [dirPath];
            }
        })
        return config.entry
    },
    output(devDirName){
        let me = this
        config.output = {
            path: path.join(me.setting.projectPath, "build"),
            filename: devDirName?"[name]/index.js":"[name]/index.[chunkhash].js",
            chunkFilename: "[name]/index.[chunkhash].js"
        }
        return config.output
    },
    plugins(devDirName){
        //devDirName = 'jgg'
        var me = this
        var entryFiles = glob.sync(me.setting.projectPath + '/src/*/index.js')
        config.plugins = []
        let ETextPlugin  = new ExtractTextPlugin('style.css')
        config.plugins.push(ETextPlugin)
        if(devDirName){
            config.plugins.push(
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"dev"'
                    }
                })
            )
        }else {
            config.plugins.push(
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    minChunks: function (module) {
                        // 该配置假定你引入的 vendor 存在于 node_modules 目录中
                        return module.context && module.context.indexOf('node_modules') !== -1;
                    }
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'manifest',  //name是提取公共代码块后js文件的名字。
                    chunks: ['vendor'] //只有在vendor中配置的文件才会提取公共代码块至manifest的js文件中
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"production"'
                    }
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                })
            )
        }
        entryFiles.forEach((dirPath)=>{
            let filePathArr = dirPath.split('\/')
            let filename = filePathArr[filePathArr.length - 2]
            if(devDirName){
                if(devDirName == filename){
                    let hmr = new webpack.HotModuleReplacementPlugin()//热模块替换插件
                    config.plugins.push(hmr)
                    let htmlPlugin = new HtmlWebpackPlugin({  // Also generate a jgg.html
                        filename: path.join(me.setting.projectPath, '/build/' + filename + '.html'),//生成的html存放路径，相对于path
                        template: path.join(me.setting.projectPath, '/src/' + filename + '/index.html') , //生成的html存放路径，相对于path
                        inject: 'body', //js插入的位置，true/'head'/'body'/false
                        //hash: true, // 为静态资源生成hash值
                        showErrors: false,  //错误信息不写入
                        chunks: ['manifest','vendor',filename], //需要引入的chunk，不配置就会引入所有页面的资源
                        minify: { //压缩HTML文件
                            removeComments: true, //移除HTML中的注释
                            collapseWhitespace: false //删除空白符与换行符
                        }
                    })
                    config.plugins.push(htmlPlugin)
                }

            }else {
                let htmlPlugin = new HtmlWebpackPlugin({  // Also generate a jgg.html
                    //favicon: path.join(me.setting.projectPath + '/image/favicon.ico'), //favicon路径，通过webpack引入同时可以生成hash值
                    filename: path.join(me.setting.projectPath, '/build/' + filename + '.html'),//生成的html存放路径，相对于path
                    template: path.join(me.setting.projectPath, '/src/' + filename + '/index.html') , //生成的html存放路径，相对于path
                    inject: 'body', //js插入的位置，true/'head'/'body'/false
                    //hash: true, // 为静态资源生成hash值
                    showErrors: false,  //错误信息不写入
                    chunks: ['manifest','vendor',filename], //需要引入的chunk，不配置就会引入所有页面的资源
                    minify: { //压缩HTML文件
                        removeComments: true, //移除HTML中的注释
                        collapseWhitespace: false //删除空白符与换行符
                    }
                })
                config.plugins.push(htmlPlugin)
            }


        });
        if(fs.existsSync('./src/script')){
            config.plugins.push(new CopyWebpackPlugin([{from: './src/script', to:  path.join(me.setting.projectPath, 'build/script/')}]))
        }
        if(fs.existsSync('./src/image')){
            config.plugins.push(new CopyWebpackPlugin([{from: './src/image', to:  path.join(me.setting.projectPath, 'build/image/')}]))
        }
        if(fs.existsSync('./MP_verify_FctEvRoUak8HPaVF.txt')){
            config.plugins.push(new CopyWebpackPlugin([{from: './MP_verify_FctEvRoUak8HPaVF.txt', to: path.join(me.setting.projectPath, '/build/MP_verify_FctEvRoUak8HPaVF.txt')}]))
        }
        return  config.plugins
    },
    module(){
        let me = this
        config.module = {}
        /*config.module.loaders =  [
            {
                jgg: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                //loader: 'babel-loader'//loader的名称（必须）
            },
            {
                jgg: /\.scss$/,
                //loader: 'style-loader!css-loader!sass-loader'
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                jgg: /\.html$/,
                //loader: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
            }

        ]*/
        config.module.rules = [
            {
                test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
                exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
                use: [
                    {
                        loader: 'babel-loader',//loader的名称（必须）
                        query:
                            {
                                compact: false,//表示不压缩
                                presets:['es2015', 'react']
                            }
                    }

                ],


            },
            {
                test: /\.scss$/,
                use:[
                    {
                        loader:'style-loader'
                    },
                    {
                        loader:'css-loader'
                    },
                    {
                        loader:'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')(),
                            ]
                        }
                    },
                    {
                        loader:'sass-loader'
                    }
                ]
            },
            {
                test: /\.html$/,
                use:[
                    {
                        loader: "raw-loader" // loaders: ['raw-loader'] is also perfectly acceptable.
                    }
                    ]

            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        //加载url-loader 同时安装 file-loader;
                        loader : 'url-loader',
                        options : {
                            //小于10000K的图片文件转base64到css里,当然css文件体积更大;
                            limit : 10000,
                            //设置最终img路径;
                            //name : './image/[name]-[hash].[ext]',
                            name : './image/[name].[ext]'
                        }
                    },
                    {
                        //压缩图片(另一个压缩图片：image-webpack-loader);
                        loader : 'img-loader?minimize&optimizationLevel=5&progressive=true'
                    },

                ]
            }
        ]
    },
    externals(){
         // config.externals = {
         //     'react': 'react'
         // }
    },
}
