const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://staging-api.arbolitics.com/:path*', // Proxy to API
      },
    ];
  },
};