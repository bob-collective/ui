import { createProxyMiddleware } from 'http-proxy-middleware';

const CHAIN = process.env.CHAIN || 'mainnet';

const API_URL = {
  mainnet: 'https://fusion-api.gobob.xyz',
  sepolia: 'https://fusion-api-sepolia.gobob.xyz'
};

const GATEWAY_API_URL = {
  mainnet: 'https://gateway-api-mainnet.gobob.xyz',
  sepolia: 'https://gateway-api-testnet.gobob.xyz'
};

const BTC_API_URL = {
  mainnet: 'https://btc-mainnet.gobob.xyz',
  sepolia: 'https://btc-testnet.gobob.xyz'
};

const proxyMiddleware = createProxyMiddleware({
  target: API_URL[CHAIN],
  router: {
    '/bob-api': API_URL[CHAIN],
    '/gateway-api': GATEWAY_API_URL[CHAIN],
    '/btc-api': BTC_API_URL[CHAIN]
  },
  changeOrigin: true,
  pathRewrite: { '^/bob-api': '', '^/gateway-api': '', '^/btc-api': '' },
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
