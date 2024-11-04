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

type StakeStore = {
  transactions: {
    isInitialLoading: boolean;
  };
};

type Store = {
  bridge: BridgeStore;
  stake: StakeStore;
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
  stake: {
    transactions: {
      isInitialLoading: true
    }
  }
});

export { store };
