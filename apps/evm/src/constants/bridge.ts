import { ChainId } from '@gobob/chains';
import { USDC } from '@gobob/tokens';
import { Address } from 'viem';

import { wstETH } from './assets';
import { L2_CHAIN } from './chain';

const configConduit = {
  [ChainId.BOB]: {
    AddressManager: '0xF2dc77c697e892542cC53336178a78Bb313DFDC7' as Address,
    BondManager: '0x0000000000000000000000000000000000000000' as Address,
    CanonicalTransactionChain: '0x0000000000000000000000000000000000000000' as Address,
    L1CrossDomainMessenger: '0xE3d981643b806FB8030CDB677D6E60892E547EdA' as Address,
    L1StandardBridge: '0x3F6cE1b36e5120BBc59D0cFe8A5aC8b6464ac1f7' as Address,
    L2OutputOracle: '0xdDa53E23f8a32640b04D7256e651C1db98dB11C1' as Address,
    OptimismPortal: '0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E' as Address,
    StateCommitmentChain: '0x0000000000000000000000000000000000000000' as Address
  },
  [ChainId.BOB_SEPOLIA]: {
    AddressManager: '0x98Ba8b9cF38732db65c7E556617135A0E6669F57' as Address,
    BondManager: '0x0000000000000000000000000000000000000000' as Address,
    CanonicalTransactionChain: '0x0000000000000000000000000000000000000000' as Address,
    L1CrossDomainMessenger: '0xB88164eE7669f1C736A55121160daB9c82b62d55' as Address,
    L1StandardBridge: '0x75f48FE4DeAB3F9043EE995c3C84D6a2303D9a2F' as Address,
    L2OutputOracle: '0xd1cBBC06213B7E14e99aDFfFeF1C249E6f9537e0' as Address,
    OptimismPortal: '0xBAAf3BAfdbd660380938b27d21c31bB7D072a799' as Address,
    StateCommitmentChain: '0x0000000000000000000000000000000000000000' as Address
  }
};

const bridgeContracts = {
  [USDC![ChainId.BOB]!.symbol]: {
    [ChainId.BOB]: {
      l1Bridge: '0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb' as Address,
      l2Bridge: '0xe497788F8Fcc30B773C9A181a0FFE2e60645cE90' as Address
    },
    [ChainId.BOB_SEPOLIA]: {
      l1Bridge: '0xA932eD4b73972c37DC4a691E8eC6f2C8a13951BE' as Address,
      l2Bridge: '0x5C2A45A35ba99d8Ee58c4bB96e2Ce30dA86C530b' as Address
    }
  },
  [wstETH[ChainId.BOB].symbol]: {
    [ChainId.BOB]: {
      l1Bridge: '0x091dF5E1284E49fA682407096aD34cfD42B95B72' as Address,
      l2Bridge: '0xd1559523374D93972E0F7fE1AA98642754f5c4d1' as Address
    }
  },
  Standard: {
    l1Bridge: configConduit[L2_CHAIN].L1StandardBridge,
    l2Bridge: '0x4200000000000000000000000000000000000010' as Address
  },
  ETH: {
    l1Bridge: configConduit[L2_CHAIN].L1StandardBridge,
    l2Bridge: '0x4200000000000000000000000000000000000010' as Address
  }
} as const;

export { bridgeContracts };
