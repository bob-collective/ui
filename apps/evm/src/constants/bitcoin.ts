import { Network } from 'bitcoin-address-validation';

import { isProd } from './chain';

export const bitcoinNetwork = isProd ? Network.mainnet : Network.testnet;

export const mempoolUrl = isProd ? 'https://mempool.space' : 'https://mempool.space/testnet';
