import { AddressLike, CrossChainMessenger, ETHBridgeAdapter, StandardBridgeAdapter } from '@eth-optimism/sdk';
import { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { ChainId } from '@gobob/chains';
import { USDC } from '@gobob/tokens';
import { Address, useAccount, useEthersProvider, useEthersSigner } from '@gobob/wagmi';
import { useMemo } from 'react';
import { isAddressEqual } from 'viem';

import { L1_CHAIN, L2_CHAIN, isL1Chain, isL2Chain, wstETH } from '@/constants';

class USDCBridgeAdapter extends StandardBridgeAdapter {
  async supportsTokenPair(l1Token: AddressLike, l2Token: AddressLike): Promise<boolean> {
    return (
      isAddressEqual(l1Token as Address, USDC[L1_CHAIN as ChainId.ETHEREUM].address) &&
      isAddressEqual(l2Token as Address, USDC[L2_CHAIN].address)
    );
  }
}

class WSTETHBridgeAdapter extends StandardBridgeAdapter {
  async supportsTokenPair(l1Token: AddressLike, l2Token: AddressLike): Promise<boolean> {
    return (
      isAddressEqual(l1Token as Address, wstETH[L1_CHAIN as ChainId.ETHEREUM].address) &&
      isAddressEqual(l2Token as Address, wstETH[L2_CHAIN].address)
    );
  }
}

const configConduit = {
  [ChainId.ETHEREUM]: {
    AddressManager: '0xF2dc77c697e892542cC53336178a78Bb313DFDC7',
    BondManager: '0x0000000000000000000000000000000000000000',
    CanonicalTransactionChain: '0x0000000000000000000000000000000000000000',
    L1CrossDomainMessenger: '0xE3d981643b806FB8030CDB677D6E60892E547EdA',
    L1StandardBridge: '0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7',
    L2OutputOracle: '0xdDa53E23f8a32640b04D7256e651C1db98dB11C1',
    OptimismPortal: '0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E',
    StateCommitmentChain: '0x0000000000000000000000000000000000000000'
  },
  [ChainId.SEPOLIA]: {
    AddressManager: '0x92B5c849AE767d2D64E9460dD15cC7d19D70084C',
    BondManager: '0x0000000000000000000000000000000000000000',
    CanonicalTransactionChain: '0x0000000000000000000000000000000000000000',
    L1CrossDomainMessenger: '0xcd5989E230D97FFE8C3C5217DEdCaC64Fa5fCeb3',
    L1StandardBridge: '0x5545B0C1C3706Ad1b428352402C3a4f0FfC84CBa',
    L2OutputOracle: '0x14D0069452b4AE2b250B395b8adAb771E4267d2f',
    OptimismPortal: '0x867B1Aa872b9C8cB5E9F7755feDC45BB24Ad0ae4',
    StateCommitmentChain: '0x0000000000000000000000000000000000000000'
  }
};

export const USDCCrossBridgeConfig = {
  [ChainId.ETHEREUM]: {
    Adapter: USDCBridgeAdapter,
    l1Bridge: '0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb',
    l2Bridge: '0xe497788F8Fcc30B773C9A181a0FFE2e60645cE90'
  },
  [ChainId.SEPOLIA]: {
    Adapter: USDCBridgeAdapter,
    l1Bridge: '0x0032303Dd587d74f79BFa3070A6293cb7cD5a4E7',
    l2Bridge: '0xc10C96F93eE4AB710C97b7c058C3DAca6b665eF7'
  }
};

const wstETHCrossBridgeConfig = {
  [ChainId.ETHEREUM]: {
    Adapter: WSTETHBridgeAdapter,
    l1Bridge: '0x091dF5E1284E49fA682407096aD34cfD42B95B72',
    l2Bridge: '0xd1559523374D93972E0F7fE1AA98642754f5c4d1'
  },
  [ChainId.SEPOLIA]: {
    Adapter: WSTETHBridgeAdapter,
    l1Bridge: '0x633464fF59E3FC760728d268BD4747d08D343D27',
    l2Bridge: '0x91a55b1294e63347AbeA88011f3B80E8643E56B3'
  }
};

const getCrossChainConfig = () => {
  const config = (configConduit as any)[L1_CHAIN];

  return {
    l1ChainId: L1_CHAIN,
    l2ChainId: L2_CHAIN,
    contracts: {
      l1: config,
      l2: {}
    },
    bridges: {
      Standard: {
        Adapter: StandardBridgeAdapter,
        l1Bridge: config.L1StandardBridge,
        l2Bridge: '0x4200000000000000000000000000000000000010' // Pre-deploy
      },
      ETH: {
        Adapter: ETHBridgeAdapter,
        l1Bridge: config.L1StandardBridge,
        l2Bridge: '0x4200000000000000000000000000000000000010' // Pre-deploy
      },
      USDC: (USDCCrossBridgeConfig as any)[L1_CHAIN],
      wstETH: (wstETHCrossBridgeConfig as any)[L1_CHAIN]
    },
    bedrock: true
  } as const;
};

const createCrossChainMessenger = (
  l1Signer: JsonRpcSigner | FallbackProvider | JsonRpcProvider | undefined,
  l2Signer: JsonRpcSigner | FallbackProvider | JsonRpcProvider | undefined
) => {
  if (l1Signer == undefined || l2Signer == undefined) {
    return null;
  }
  const crossChainConfig = getCrossChainConfig();

  const config = {
    ...crossChainConfig,
    l1SignerOrProvider: l1Signer,
    l2SignerOrProvider: l2Signer
  };

  const messenger = new CrossChainMessenger(config);

  return messenger;
};

const useCrossChainMessenger = () => {
  const l1Provider = useEthersProvider({ chainId: L1_CHAIN });
  const l2Provider = useEthersProvider({ chainId: L2_CHAIN });
  const l1Signer = useEthersSigner({ chainId: L1_CHAIN });
  const l2Signer = useEthersSigner({ chainId: L2_CHAIN });

  const { chain } = useAccount();

  return useMemo(
    () =>
      chain && isL1Chain(chain as any)
        ? createCrossChainMessenger(l1Signer, l2Provider)
        : chain && isL2Chain(chain as any)
          ? createCrossChainMessenger(l1Provider, l2Signer)
          : createCrossChainMessenger(l1Provider, l2Provider),
    [chain, l1Provider, l1Signer, l2Provider, l2Signer]
  );
};

export { useCrossChainMessenger };
