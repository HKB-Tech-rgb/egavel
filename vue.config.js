//const proxyMiddleware = require('http-proxy-middleware')
const PROXY = 'http://localhost:3001'
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    disableHostCheck: true,
    public: "0.0.0.0",
    proxy: {
        '/': {
          target: PROXY,
          ws: false,
          changeOrigin: true,
          secure: false,
          //pathRewrite: {'/' : '/'}
         
        }
    },
    //after: app => app.use('/', proxyMiddleware(PROXY))
},
}
