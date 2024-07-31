import { ChainId, isTestnetChainId } from '@gobob/chains';
import { bob, bobSepolia, mainnet, oldBobSepolia, sepolia } from '@gobob/wagmi';
import { Chain } from 'viem';

const L1_CHAIN = Number(import.meta.env.VITE_L1_CHAIN_NAME) as ChainId;

if (!L1_CHAIN || !ChainId[L1_CHAIN]) {
  throw new Error('Missing or invalid L1 chain');
}

const isL1Testnet = isTestnetChainId(L1_CHAIN);

const L2_CHAIN = Number(import.meta.env.VITE_L2_CHAIN_NAME) as ChainId;

if (!L2_CHAIN || !ChainId[L1_CHAIN] || L1_CHAIN === L2_CHAIN || (isL1Testnet && !isTestnetChainId(L2_CHAIN))) {
  throw new Error('Missing or invalid L2 chain');
}

const isL1Chain = (chain: Chain) => chain?.id === L1_CHAIN;

const isL2Chain = (chain: Chain) => chain?.id === L2_CHAIN;

const isValidChain = (chainId: ChainId) => chainId === L1_CHAIN || chainId === L2_CHAIN;

const isProd = !isL1Testnet;

const chainL1: Chain = isProd ? mainnet : sepolia;
const chainL2: Chain = isProd ? bob : bobSepolia.id === L2_CHAIN ? bobSepolia : oldBobSepolia;

export { L1_CHAIN, L2_CHAIN, chainL1, chainL2, isL1Chain, isL2Chain, isProd, isValidChain };
