import { isTestnetChainId } from '@gobob/chains';
import { BitcoinNetwork } from '@gobob/types';

import { L1_CHAIN, isProd } from './chain';

export const bitcoinNetwork: BitcoinNetwork = isTestnetChainId(L1_CHAIN) ? 'testnet' : 'mainnet';

export const mempoolUrl = isProd ? 'https://mempool.space' : 'https://mempool.space/testnet';
