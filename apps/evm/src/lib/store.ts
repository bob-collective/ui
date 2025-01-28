import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction } from '../types';

type SharedStore = {
  turnstile: {
    isOpen: boolean;
    token?: string;
    onSuccess?: (token: string) => void;
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
    turnstile: {
      isOpen: false
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
