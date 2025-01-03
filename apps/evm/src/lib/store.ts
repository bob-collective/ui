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

type StrategiesStore = {
  transactions: {
    isInitialLoading: boolean;
  };
};

type Store = {
  bridge: BridgeStore;
  strategies: StrategiesStore;
};

const store = new StoreLib<Store>({
  bridge: {
    transactions: {
      isInitialLoading: true,
      bridge: {
        unconfirmed: []
      }
    }
  },
  strategies: {
    transactions: {
      isInitialLoading: true
    }
  }
});

export { store };
