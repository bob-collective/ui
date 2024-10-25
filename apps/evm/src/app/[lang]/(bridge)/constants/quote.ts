import { GatewayQuoteParams } from '@gobob/bob-sdk';

const DEFAULT_GATEWAY_QUOTE_PARAMS: Required<Pick<GatewayQuoteParams, 'fromChain' | 'fromToken' | 'gasRefill'>> = {
  fromChain: 'bitcoin',
  fromToken: 'BTC',
  // TODO: should be dynamic based on exchange rate
  gasRefill: 2000
};

export { DEFAULT_GATEWAY_QUOTE_PARAMS };
