import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction } from '../types';

type SharedStore = {
  isReceiveModalOpen: boolean;
};

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
  shared: SharedStore;
  bridge: BridgeStore;
  stake: StakeStore;
};

const store = new StoreLib<Store>({
  shared: {
    isReceiveModalOpen: false
  },
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
