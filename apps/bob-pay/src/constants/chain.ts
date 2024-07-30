import { ChainId } from '@gobob/chains';

const CHAIN = Number(import.meta.env.VITE_CHAIN_ID) as ChainId;

if (!CHAIN) {
  throw new Error('Missing chain');
}

export { CHAIN };
