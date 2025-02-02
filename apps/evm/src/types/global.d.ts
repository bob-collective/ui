declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // client
      NEXT_PUBLIC_FUSION_API_URL: string;
      NEXT_PUBLIC_GATEWAY_API_URL: string;
      NEXT_PUBLIC_BLOCKSCOUT_API_URL: string;
      NEXT_PUBLIC_BTC_API_URL: string;
      NEXT_PUBLIC_L1_CHAIN: `${number}`;
      NEXT_PUBLIC_L2_CHAIN: `${number}`;
      NEXT_COINGECKO_API_KEY: string;
      NEXT_PUBLIC_GEOBLOCK_ENABLED: `${boolean}`;
      NEXT_PUBLIC_INDEXER_URL: string;
      NEXT_PUBLIC_SENTRY_AUTH_TOKEN: string;
      NEXT_PUBLIC_SENTRY_URL: string;
      NEXT_PUBLIC_GTM_ID: string;
      NEXT_PUBLIC_GA_ID: string;
      NEXT_PUBLIC_TRACES_SAMPLE_RATE: `${number}`;
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: string;

      NEXT_PUBLIC_POSTHOG_KEY: string;
      NEXT_PUBLIC_POSTHOG_HOST: string;

      SENTRY_AUTH_TOKEN: string;
      NEXT_PUBLIC_FEATURE_FLAG_OP_SUPERUSER: 'enabled' | 'disabled';
      NEXT_PUBLIC_FEATURE_FLAG_TOP_100_SPICE_USERS: 'enabled' | 'disabled';
    }
  }
}

export {};
