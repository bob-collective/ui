import { ChainId, getChainIdByChainName, isTestnetChainId } from '@gobob/chains';
import { bob, bobSepolia, mainnet, sepolia } from '@gobob/wagmi';
import { Chain } from 'viem';

const L1_CHAIN = getChainIdByChainName(process.env.NEXT_PUBLIC_L1_CHAIN_NAME) as ChainId;

if (!L1_CHAIN) {
  throw new Error('Missing L1 chain');
}

if (L1_CHAIN !== ChainId.ETHEREUM && L1_CHAIN !== ChainId.SEPOLIA) {
  throw new Error('Missing L1 chain');
}

const L2_CHAIN = isTestnetChainId(L1_CHAIN) ? ChainId.BOB_SEPOLIA : ChainId.BOB;

const isL1Chain = (chain: Chain) => chain?.id === L1_CHAIN;

const isL2Chain = (chain: Chain) => chain?.id === L2_CHAIN;

const isValidChain = (chainId: ChainId) => chainId === L1_CHAIN || chainId === L2_CHAIN;

const isProd = !isTestnetChainId(L1_CHAIN);

const chainL1: Chain = isProd ? mainnet : sepolia;
const chainL2: Chain = isProd ? bob : bobSepolia;

export { L1_CHAIN, L2_CHAIN, chainL1, chainL2, isL1Chain, isL2Chain, isProd, isValidChain };
