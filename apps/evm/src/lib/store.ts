import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction } from '../types';

type BridgeStore = {
  transactions: {
    isInitialLoading: boolean;
    bridge: {
      unconfirmed: BridgeTransaction[];
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
      }
    }
  }
});

export { store };
