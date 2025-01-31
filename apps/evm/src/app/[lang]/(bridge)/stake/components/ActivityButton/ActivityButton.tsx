import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Button, SolidClock, Tooltip } from '@gobob/ui';
import { useAccount } from 'wagmi';
import { Trans } from '@lingui/macro';

import { useConnectModal } from '@/connect-ui';
import { SharedStoreProfileTxType, ShareStoreProfileTabs, store } from '@/lib/store';
import { posthogEvents } from '@/lib/posthog';

const ActivityButton = (): JSX.Element => {
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsAccount();
  const { open } = useConnectModal();

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

    posthogEvents.wallet.drawer.activity('strategies');
  };

  const isLoggedIn = !!(evmAddress || btcAddress);

  const handlePressActivity = () => {
    if (!isLoggedIn) {
      return open({ onConnectBtc: handleOpenProfile, onConnectEvm: handleOpenProfile });
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
