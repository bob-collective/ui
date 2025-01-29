import { Button, Card, Flex, Skeleton, SolidClock, Span, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';

import { useBtcAccount, useGetBridgeTransactions } from '@/hooks';
import { SharedStoreProfileTxStatus, SharedStoreProfileTxType, ShareStoreProfileTabs, store } from '@/lib/store';

const ActivityButton = (): JSX.Element => {
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const { txPendingUserAction, isPending: isBridgeTxPending } = useGetBridgeTransactions();

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
              status: hasPendingTx ? SharedStoreProfileTxStatus.NEEDED_ACTION : undefined,
              type: SharedStoreProfileTxType.NATIVE_BRIDGE
            }
          }
        }
      }
    }));
  };

  const isLoggedIn = !!(evmAddress || btcAddress);

  const handleActivity = () => {
    if (!isLoggedIn) {
      // FIXME:
      return;
      // return open({ onConnectBtc: handleOpenProfile, onConnectEvm: handleOpenProfile });
    }

    handleOpenProfile();
  };

  if (!isLoggedIn) {
    return (
      <Button size='s' style={{ gap: 4, alignItems: 'center' }} onPress={handleActivity}>
        <SolidClock />
        <Trans>Activity</Trans>
      </Button>
    );
  }

  const hasPendingTx = txPendingUserAction && txPendingUserAction > 0;

  return (
    <Button size='s' style={{ gap: 4, alignItems: 'center' }} onPress={handleOpenProfile}>
      <Flex alignItems='center' elementType='span' gap='s'>
        <SolidClock />
        {isBridgeTxPending ? (
          <Skeleton height='1.5rem' width='5rem' />
        ) : hasPendingTx ? (
          <Card
            alignItems='center'
            background='primary-500'
            direction='row'
            gap='s'
            paddingX='md'
            paddingY='xxs'
            rounded='s'
          >
            <Span size='xs'>
              <Trans>Action needed</Trans>
            </Span>
            <Spinner color='default' size='12' thickness={2} />
          </Card>
        ) : (
          <Trans>Activity</Trans>
        )}
      </Flex>
    </Button>
  );
};

export { ActivityButton };
