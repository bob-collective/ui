import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction } from '../types';

type SharedStore = {
  isReceiveModalOpen: boolean;
  profile: {
    isOpen: boolean;
    hasOpenned: boolean;
    selectedTab: 'wallet' | 'activity';
    activityFilters: {
      type?: string;
      status?: string;
    };
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
      isOpen: false,
      hasOpenned: false,
      selectedTab: 'wallet',
      activityFilters: {
        status: undefined,
        type: undefined
      }
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
export type { SharedStore };
