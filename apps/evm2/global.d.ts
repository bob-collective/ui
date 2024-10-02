declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // client
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_GATEWAY_API_URL: string;
      NEXT_PUBLIC_BTC_API_URL: string;
      NEXT_PUBLIC_L1_CHAIN: `${number}`;
      NEXT_PUBLIC_L2_CHAIN: `${number}`;
      NEXT_PUBLIC_COINGECKO_API_KEY: string;
      NEXT_PUBLIC_MARKET_DATA_API: string;
      NEXT_PUBLIC_GEOBLOCK_ENABLED: `${boolean}`;
      NEXT_PUBLIC_FEATURE_FLAG_BTC_GATEWAY: 'enabled' | 'disabled';
      NEXT_PUBLIC_INDEXER_URL: string;
      NEXT_PUBLIC_SENTRY_AUTH_TOKEN: string;
      NEXT_PUBLIC_SENTRY_URL: string;
      NEXT_PUBLIC_TRACES_SAMPLE_RATE: `${number}`;
    }
  }
}

export {};
