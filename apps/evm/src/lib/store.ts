import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction } from '../types';

type SharedStore = {
  isReceiveModalOpen: boolean;
  profile: {
    hasOpenned: boolean;
  };
};

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
  shared: SharedStore;
  bridge: BridgeStore;
  strategies: StrategiesStore;
};

const store = new StoreLib<Store>({
  shared: {
    isReceiveModalOpen: false,
    profile: {
      hasOpenned: false
    }
  },
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
