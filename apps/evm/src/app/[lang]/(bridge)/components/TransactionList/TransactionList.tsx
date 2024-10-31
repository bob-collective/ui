import { CardProps, Divider, Flex, H2, Link, P, Spinner } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Trans } from '@lingui/macro';
import { Fragment, useMemo } from 'react';
import { useIsClient } from 'usehooks-ts';

import { TransactionItem } from './TransactionItem';
import {
  StyledSection,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionList,
  StyledTransactionListWrapper
} from './TransactionList.style';

import { chainL2 } from '@/constants';
import { Transaction } from '@/types';

type Props = {
  isInitialLoading?: boolean;
  data?: Transaction[];
  onProveSuccess?: () => void;
  onRelaySuccess?: () => void;
  txPendingUserAction?: number;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type TransactionListProps = Props & InheritAttrs;

const TransactionList = ({
  isInitialLoading,
  data,
  onProveSuccess,
  onRelaySuccess,
  txPendingUserAction,
  ...props
}: TransactionListProps): JSX.Element => {
  const { address, chain } = useAccount();
  const isClient = useIsClient();

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
    <StyledSection gap='xl' paddingX='4xl' paddingY='3xl' {...props}>
      <H2 size='md'>{title}</H2>
      <StyledTransactionListWrapper direction='column' flex={1}>
        <Divider />
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
                    <TransactionItem
                      data={transaction}
                      onProveSuccess={onProveSuccess}
                      onRelaySuccess={onRelaySuccess}
                    />
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
