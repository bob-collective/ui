import { Store as StoreLib } from '@tanstack/store';

import { BridgeTransaction } from '../types';

type BridgeStore = {
  transactions: {
    isInitialLoading: boolean;
    unconfirmed: BridgeTransaction[];
  };
};

type Store = {
  bridge: BridgeStore;
};

const store = new StoreLib<Store>({
  bridge: {
    transactions: {
      isInitialLoading: true,
      unconfirmed: []
    }
  }
});

export { store };
export type { Store };
