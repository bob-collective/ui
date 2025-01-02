import { CardProps, Divider, Flex, H2, Link, P, Spinner } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo, useRef } from 'react';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';
import { useVirtualizer } from '@tanstack/react-virtual';

import { TransactionItem } from './TransactionItem';
import {
  StyledSection,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionList,
  StyledTransactionListParent,
  StyledTransactionListWrapper,
  StyledVirtualizer,
  StyledVirtualizerItem
} from './TransactionList.style';

import { chainL2 } from '@/constants';
import { Transaction } from '@/types';

type Props = {
  type: 'bridge' | 'stake';
  isInitialLoading?: boolean;
  data?: Transaction[];
  onProveSuccess?: () => void;
  onRelaySuccess?: () => void;
  txPendingUserAction?: number;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type TransactionListProps = Props & InheritAttrs;

const TransactionList = ({
  type,
  isInitialLoading,
  data,
  onProveSuccess,
  onRelaySuccess,
  txPendingUserAction,
  ...props
}: TransactionListProps): JSX.Element => {
  const { i18n } = useLingui();
  const isClient = useIsClient();
  // The scrollable element for your list
  const parentRef = useRef(null);

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: data?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 102,
    paddingStart: 16,
    paddingEnd: 16,
    gap: 16,
    // https://github.com/TanStack/table/blob/main/examples/react/virtualized-rows/src/main.tsx#L88
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    measureElement: (element) => {
      return isClient && navigator.userAgent.indexOf('Firefox') === -1
        ? element?.getBoundingClientRect().height
        : undefined;
    },
    overscan: 5
  });

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
  const txType = type === 'bridge' ? t(i18n)`bridging` : t(i18n)`staking`;

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
        >
          {!isClient || isInitialLoading ? (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <Spinner size='16' thickness={2} />
              <P align='center' size='xs'>
                <Trans>Fetching {txType} operations...</Trans>
              </P>
            </Flex>
          ) : (
            <>
              {hasData ? (
                <StyledTransactionListParent ref={parentRef}>
                  <StyledVirtualizer $height={rowVirtualizer.getTotalSize()}>
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                      <StyledVirtualizerItem
                        key={virtualItem.key}
                        ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                        $translateY={virtualItem.start}
                        data-index={virtualItem.index} //needed for dynamic row height measurement
                      >
                        <TransactionItem
                          data={data[virtualItem.index]!}
                          onProveSuccess={onProveSuccess}
                          onRelaySuccess={onRelaySuccess}
                        />
                        {virtualItem.index < data.length - 1 && <Divider style={{ marginTop: '1rem' }} />}
                      </StyledVirtualizerItem>
                    ))}
                  </StyledVirtualizer>
                </StyledTransactionListParent>
              ) : (
                <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
                  <P align='center' size='xs'>
                    <Trans>No {txType} operations found</Trans>
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
