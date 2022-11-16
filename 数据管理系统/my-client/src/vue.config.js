module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    devServer: {
        open: true,
        host: 'localhost',
        port: '8080',
        proxy: {
            '/api': {
                target: 'http://localhost:5000', // 你要请求的地址
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};