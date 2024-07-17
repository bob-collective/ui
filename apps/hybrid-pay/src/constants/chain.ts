import { ChainId, getChainIdByChainName } from '@gobob/chains';

const CHAIN = getChainIdByChainName(import.meta.env.VITE_CHAIN_NAME) as ChainId;

if (!CHAIN) {
  throw new Error('Missing L1 chain');
}

export { CHAIN };
