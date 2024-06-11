import { ArrowTopRightOnSquare, CardProps, Divider, Flex, H2, P, Span, Spinner } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Fragment, useMemo } from 'react';

import { chainL2 } from '../../../../constants';
import { useGetTransactions } from '../../hooks';
import { MessageStatus } from '../../types';

import { TransactionItem } from './TransactionItem';
import {
  StyledSection,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionList,
  StyledTransactionListWrapper,
  StyledViewTransactions
} from './TransactionList.style';

type TransactionListProps = CardProps;

const TransactionList = (props: TransactionListProps): JSX.Element => {
  const { address, chain } = useAccount();
  const { data: transactions, isInitialLoading } = useGetTransactions();

  const pendingInteractions = useMemo(
    () =>
      !isInitialLoading &&
      transactions?.filter(
        (transaction) =>
          transaction.status === MessageStatus.READY_TO_PROVE || transaction.status === MessageStatus.READY_FOR_RELAY
      ).length,
    [transactions, isInitialLoading]
  );

  const title = (
    <Flex alignItems='center' elementType='span' gap='s'>
      Activity
      {!!pendingInteractions && (
        <StyledSpan size='xs' weight='medium'>
          {pendingInteractions}
          <StyledSpinnerWrapper>
            <Spinner color='primary' size='24' thickness={2} />
          </StyledSpinnerWrapper>
        </StyledSpan>
      )}
    </Flex>
  );

  const explorerUrl = useMemo(() => (chain || chainL2).blockExplorers?.default.url, [chain]);

  const txsUrl = address ? `${explorerUrl}/address/${address}` : `${explorerUrl}`;

  return (
    <StyledSection gap='xl' paddingX='4xl' paddingY='3xl' {...props}>
      <H2 size='md'>{title}</H2>
      <StyledTransactionListWrapper direction='column' flex={1}>
        <Divider />
        <StyledTransactionList
          direction='column'
          flex={1}
          gap='xl'
          justifyContent={isInitialLoading || !transactions?.length ? 'center' : undefined}
          paddingY='xl'
        >
          {isInitialLoading ? (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <Spinner size='16' thickness={2} />
              <P align='center' size='xs'>
                Fetching bridging operations...
              </P>
            </Flex>
          ) : (
            <>
              {transactions?.length ? (
                transactions.map((transaction, idx) => (
                  <Fragment key={idx}>
                    <TransactionItem data={transaction} />
                    {idx < transactions.length - 1 && <Divider />}
                  </Fragment>
                ))
              ) : (
                <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
                  <P align='center' size='xs'>
                    No bridging operations found
                  </P>
                </Flex>
              )}
            </>
          )}
        </StyledTransactionList>
        <Divider />
      </StyledTransactionListWrapper>
      <StyledViewTransactions href={txsUrl} rel='noreferrer' target='_blank'>
        <Span color='grey-300' size='s'>
          View All Transactions
        </Span>
        <ArrowTopRightOnSquare color='grey-300' size='s' />
      </StyledViewTransactions>
    </StyledSection>
  );
};

export { TransactionList };
