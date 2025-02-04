import { defineChain } from 'viem';
import { mainnet as wagmiMainnet } from 'viem/chains';

export const mainnet = defineChain({
  ...wagmiMainnet,
  rpcUrls: {
    ...wagmiMainnet.rpcUrls,
    default: {
      // NOTE: fixes sentry `All promises were rejected`
      // override rpc url if needed
      http: ['https://ethereum-rpc.publicnode.com']
    },
    public: {
      http: ['https://ethereum-rpc.publicnode.com']
    }
  },
  contracts: {
    ...wagmiMainnet.contracts,
    l2OutputOracle: {
      [wagmiMainnet.id]: {
        address: '0xdDa53E23f8a32640b04D7256e651C1db98dB11C1',
        blockCreated: 4462615
      }
    },
    portal: {
      [wagmiMainnet.id]: {
        address: '0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E',
        blockCreated: 4462615
      }
    }
  }
});
