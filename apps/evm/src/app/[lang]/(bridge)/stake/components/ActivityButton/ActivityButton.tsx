import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Button, SolidClock, Tooltip } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { SharedStoreProfileTxType, ShareStoreProfileTabs, store } from '@/lib/store';

const ActivityButton = (): JSX.Element => {
  const isLoggedIn = useIsLoggedIn();

  const handleOpenProfile = () => {
    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        profile: {
          ...state.shared.profile,
          isOpen: true,
          selectedTab: ShareStoreProfileTabs.ACTIVITY,
          transactions: {
            filters: {
              ...state.shared.profile.transactions.filters,
              status: undefined,
              type: SharedStoreProfileTxType.STRATEGIES
            }
          }
        }
      }
    }));
  };

  const handlePressActivity = () => {
    if (!isLoggedIn) {
      // FIXME:

      // return open({ onConnectBtc: handleOpenProfile, onConnectEvm: handleOpenProfile });
      return;
    }

    handleOpenProfile();
  };

  return (
    <Tooltip label={<Trans>Activity</Trans>}>
      <Button isIconOnly style={{ width: '2.75rem', height: '2.75rem' }} onPress={handlePressActivity}>
        <SolidClock />
      </Button>
    </Tooltip>
  );
};

export { ActivityButton };
