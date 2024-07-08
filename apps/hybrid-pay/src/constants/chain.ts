import { ChainId, getChainIdByChainName, isTestnetChainId } from '@gobob/chains';

const CHAIN = getChainIdByChainName(import.meta.env.VITE_CHAIN_NAME) as ChainId;

if (!CHAIN) {
  throw new Error('Missing L1 chain');
}

const isProd = !isTestnetChainId(CHAIN);

export { CHAIN, isProd };
