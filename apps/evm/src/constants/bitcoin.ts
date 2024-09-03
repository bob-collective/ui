import { isTestnetChainId } from '@gobob/chains';
import { Network } from '@gobob/sats-wagmi';

import { L1_CHAIN, isProd } from './chain';

export const bitcoinNetwork = (isTestnetChainId(L1_CHAIN) ? 'testnet' : 'mainnet') as Network;

export const mempoolUrl = isProd ? 'https://mempool.space' : 'https://mempool.space/testnet';
