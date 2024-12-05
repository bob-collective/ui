import { Divider, Flex, P, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { Fragment } from 'react';
import { useIsClient } from 'usehooks-ts';

import { TransactionItem } from './TransactionItem';
import { StyledTransactionList } from './TransactionList.style';

import { Transaction } from '@/types';

type TransactionListProps = {
  isInitialLoading?: boolean;
  data?: Transaction[];
  onProveSuccess?: () => void;
  onRelaySuccess?: () => void;
};

const TransactionList = ({
  isInitialLoading,
  data,
  onProveSuccess,
  onRelaySuccess
}: TransactionListProps): JSX.Element => {
  const isClient = useIsClient();

  const hasData = !!data?.length;

  return (
    <StyledTransactionList
      direction='column'
      flex={1}
      gap='xl'
      justifyContent={isInitialLoading || !hasData ? 'center' : undefined}
      paddingY='xl'
    >
      {!isClient || isInitialLoading ? (
        <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
          <Spinner size='16' thickness={2} />
          <P align='center' size='xs'>
            <Trans>Fetching bridging operations...</Trans>
          </P>
        </Flex>
      ) : (
        <>
          {hasData ? (
            data.map((transaction, idx) => (
              <Fragment key={idx}>
                <TransactionItem data={transaction} onProveSuccess={onProveSuccess} onRelaySuccess={onRelaySuccess} />
                {idx < data.length - 1 && <Divider />}
              </Fragment>
            ))
          ) : (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <P align='center' size='xs'>
                <Trans>No bridging operations found</Trans>
              </P>
            </Flex>
          )}
        </>
      )}
    </StyledTransactionList>
  );
};

export { TransactionList };
