/**
 * Created by stone on 2017/6/10.
 */
module.exports = {
    '/api/': {
        target: 'http://www.jggvip.com',
        changeOrigin: true,
        //secure: false
    },
    '/graphql': {
        target: 'http://api.jggvip.com',
        changeOrigin: true,
        //secure: false
    },
    '/game/': {
        target: 'http://api.xintiaotime.com',
        changeOrigin: true,
        //secure: false
    },
    '/hook/':{
        target: 'http://cms.xintiaotime.com/',
        changeOrigin: true
    },
    '/read/':{
        target: 'http://api.xintiaotime.com/',
        changeOrigin: true
    }
}