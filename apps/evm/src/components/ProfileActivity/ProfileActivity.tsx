import { Flex, P, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { TransactionItem } from './TransactionItem';
import { StyledSpan, StyledSpinnerWrapper, StyledTransactionList } from './TransactionList.style';

import { chainL2 } from '@/constants';
import { useGetTransactions } from '@/app/[lang]/(bridge)/bridge/hooks';

const ProfileActivity = (): JSX.Element => {
  const { i18n } = useLingui();
  const isClient = useIsClient();
  // The scrollable element for your list

  const { data, isInitialLoading, refetch, txPendingUserAction } = useGetTransactions();

  const { address, chain } = useAccount();

  const title = (
    <Flex alignItems='center' elementType='span' gap='s'>
      Activity
      {!!txPendingUserAction && (
        <StyledSpan size='xs' weight='medium'>
          {txPendingUserAction}
          <StyledSpinnerWrapper>
            <Spinner color='primary' size='24' thickness={2} />
          </StyledSpinnerWrapper>
        </StyledSpan>
      )}
    </Flex>
  );

  const explorerUrl = useMemo(() => (chain || chainL2).blockExplorers?.default.url, [chain]);

  const txsUrl = address ? `${explorerUrl}/address/${address}` : `${explorerUrl}`;
  const hasData = !!data?.length;

  return (
    <StyledTransactionList
      direction='column'
      flex={1}
      gap='md'
      justifyContent={isInitialLoading || !hasData ? 'center' : undefined}
      marginTop='md'
    >
      {!isClient || isInitialLoading ? (
        <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
          <Spinner size='16' thickness={2} />
          <P align='center' size='xs'>
            <Trans>Fetching operations...</Trans>
          </P>
        </Flex>
      ) : (
        <>
          {hasData ? (
            data.map((data, key) => (
              <TransactionItem key={key} data={data} onProveSuccess={refetch.bridge} onRelaySuccess={refetch.bridge} />
            ))
          ) : (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <P align='center' size='xs'>
                <Trans>No operations found</Trans>
              </P>
            </Flex>
          )}
        </>
      )}
    </StyledTransactionList>
  );
};

export { ProfileActivity };
