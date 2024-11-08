import { ChainId } from '@gobob/chains';

const CHAIN = Number(process.env.NEXT_PUBLIC_CHAIN_ID) as ChainId;

if (!CHAIN) {
  throw new Error('Missing chain');
}

export { CHAIN };
