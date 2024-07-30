import { createProxyMiddleware } from 'http-proxy-middleware';

const proxyMiddleware = createProxyMiddleware({
  router: {
    '/api': 'https://app.gobob.xyz/api',
    '/dynamic-api': 'https://app.dynamicauth.com/api/v0'
  },
  changeOrigin: true,
  pathRewrite: { '^/dynamic-api': '', '^/api': '' },
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.setHeader('x-sec-token', 'foobar');
    },
    proxyRes: (proxyRes) => {
      // vary: accept-encoding to handle caching of compressed responses
      proxyRes.headers['vary'] = 'accept-encoding';
    }
  }
});

export default function handler(req, res) {
  proxyMiddleware(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
}
