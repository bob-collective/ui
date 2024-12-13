import { ChainId, isTestnetChainId } from '@gobob/chains';
import { Chain } from 'viem';

import { bob, bobSepolia, mainnet, sepolia } from '@/lib/wagmi';

const validL1Chains = [ChainId.SEPOLIA, ChainId.ETHEREUM] as const;

const L1_CHAIN = Number(process.env.NEXT_PUBLIC_L1_CHAIN) as (typeof validL1Chains)[number];

if (!L1_CHAIN || !validL1Chains.includes(L1_CHAIN)) {
  throw new Error('Missing or invalid L1 chain');
}

const isL1Testnet = isTestnetChainId(L1_CHAIN);

const validL2Chains = [ChainId.BOB_SEPOLIA, ChainId.BOB] as const;

const L2_CHAIN = Number(process.env.NEXT_PUBLIC_L2_CHAIN) as (typeof validL2Chains)[number];

if (!L2_CHAIN || !validL2Chains.includes(L2_CHAIN) || (isL1Testnet && !isTestnetChainId(L2_CHAIN))) {
  throw new Error('Missing or invalid L2 chain');
}

const isProd = !isL1Testnet;

const chainL1: Chain = isProd ? mainnet : sepolia;
const chainL2: Chain = isProd ? bob : bobSepolia;

export { chainL1, chainL2, isProd, L1_CHAIN, L2_CHAIN };
