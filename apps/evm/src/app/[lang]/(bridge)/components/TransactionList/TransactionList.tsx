import { CardProps, Divider, Flex, H2, Link, P, Spinner } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Fragment, useMemo } from 'react';
import { useIsClient } from 'usehooks-ts';
import { Trans } from '@lingui/macro';

import { Transaction } from '../../hooks';

import { TransactionItem } from './TransactionItem';
import {
  StyledSection,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionList,
  StyledTransactionListWrapper
} from './TransactionList.style';

import { chainL2 } from '@/constants';
import { MessageStatus } from '@/types';

type Props = {
  isInitialLoading?: boolean;
  data?: Transaction[];
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type TransactionListProps = Props & InheritAttrs;

const TransactionList = ({ isInitialLoading, data, ...props }: TransactionListProps): JSX.Element => {
  const { address, chain } = useAccount();
  const isClient = useIsClient();

  const pendingInteractions = useMemo(
    () =>
      !isInitialLoading &&
      data?.filter(
        (transaction) =>
          transaction.status === MessageStatus.READY_TO_PROVE || transaction.status === MessageStatus.READY_FOR_RELAY
      ).length,
    [data, isInitialLoading]
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
          justifyContent={isInitialLoading || !data?.length ? 'center' : undefined}
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
              {data?.length ? (
                data.map((transaction, idx) => (
                  <Fragment key={idx}>
                    <TransactionItem data={transaction} />
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
        <Divider />
      </StyledTransactionListWrapper>
      <Link external icon href={txsUrl} size='s'>
        <Trans>View All Transactions</Trans>
      </Link>
    </StyledSection>
  );
};

export { TransactionList };