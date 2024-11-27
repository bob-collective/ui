import { Address } from 'viem';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // client
      NEXT_PUBLIC_CHAIN_ID: string;
      NEXT_PUBLIC_FUSION_API_URL: string;

      NEXT_PUBLIC_DYNAMIC_API_URL: string;
      NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID: string;
      NEXT_PUBLIC_DYNAMIC_API_KEY: string;

      NEXT_PUBLIC_PIMLICO_API_KEY: string;

      NEXT_GUARANTOR_PRIVATE_KEY: Address;

      NEXT_PUBLIC_INDEXER_URL: string;

      NEXT_COINGECKO_API_KEY: string;

      KV_REST_API_URL: string;
      KV_REST_API_TOKEN: string;

      SENTRY_AUTH_TOKEN: string;
    }
  }
}

export {};
