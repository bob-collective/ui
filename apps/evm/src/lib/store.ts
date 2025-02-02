import { Store as StoreLib } from '@tanstack/react-store';

import { BridgeTransaction } from '../types';

enum SharedStoreProfileTxStatus {
  ANY_STATUS = 'default',
  PENDING = 'pending',
  NEEDED_ACTION = 'needed-action',
  COMPLETE = 'complete',
  FAILED = 'failed'
}

enum SharedStoreProfileTxType {
  ALL_TRANSACTIONS = 'default',
  NATIVE_BRIDGE = 'native-bridge',
  BTC_BRIDGE = 'btc-bridge',
  STRATEGIES = 'strategies'
}

enum ShareStoreProfileTabs {
  WALLET = 'wallet',
  ACTIVITY = 'activity'
}

type SharedStore = {
  isReceiveModalOpen: boolean;
  profile: {
    isOpen: boolean;
    hasOpenned: boolean;
    selectedTab: ShareStoreProfileTabs;
    transactions: {
      filters: {
        type?: SharedStoreProfileTxType;
        status?: SharedStoreProfileTxStatus;
      };
    };
  };
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
    isReceiveModalOpen: false,
    profile: {
      isOpen: false,
      hasOpenned: false,
      selectedTab: ShareStoreProfileTabs.WALLET,
      transactions: {
        filters: {
          status: undefined,
          type: undefined
        }
      }
    },
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

export { store, ShareStoreProfileTabs, SharedStoreProfileTxStatus, SharedStoreProfileTxType };
