import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction, GatewayTransaction } from '../types';

type BridgeStore = {
  transactions: {
    isInitialLoading: boolean;
    bridge: {
      unconfirmed: BridgeTransaction[];
    };
    gateway: {
      unconfirmed: GatewayTransaction[];
    };
  };
};

type Store = {
  bridge: BridgeStore;
};

const store = new StoreLib<Store>({
  bridge: {
    transactions: {
      isInitialLoading: true,
      bridge: {
        unconfirmed: []
      },
      gateway: {
        unconfirmed: []
      }
    }
  }
});

export { store };
