import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { ArrowLongRight, Flex, FlexProps, P, UnstyledButton } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { formatDistanceToNow } from 'date-fns';

import { StyledDetailsButton, StyledExpandIcon } from './TransactionList.style';

import { ChainLogo } from '@/components';
import { TransactionDirection } from '@/types';

type Props = {
  direction: TransactionDirection;
  date: Date;
  fromChainId: ChainId | 'BTC';
  toChainId: ChainId | 'BTC';
  amount?: CurrencyAmount<Currency>;
  isPending?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type TransactionDetailsProps = Props & InheritAttrs;

const TransactionDetails = ({
  direction,
  date,
  fromChainId,
  toChainId,
  amount,
  isPending,
  isExpanded,
  onExpand,
  ...props
}: TransactionDetailsProps): JSX.Element => {
  const directionLabel = direction === TransactionDirection.L1_TO_L2 ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>;

  const isExpandable = !!onExpand;

  return (
    <Flex direction='column' {...props}>
      <Flex justifyContent='space-between'>
        <Flex alignItems='center' gap='s'>
          <Flex alignItems='center' gap='md'>
            <ChainLogo chainId={fromChainId} size='xs' />
            <ArrowLongRight color='grey-50' size='s' />
            <ChainLogo chainId={toChainId} size='xs' />
          </Flex>
          <P color='grey-50' size='xs' weight='semibold'>
            {directionLabel}
          </P>
        </Flex>
        <P color='grey-50' size='xs' weight='semibold'>
          <Trans>{formatDistanceToNow(date)} ago</Trans>
        </P>
      </Flex>
      <StyledDetailsButton elementType={onExpand ? UnstyledButton : undefined} {...{ onPress: onExpand }}>
        <Flex wrap gap='s' justifyContent='space-between' style={{ width: '100%' }}>
          <Flex gap='md'>
            {(isPending && (
              <P size='s' weight='medium'>
                <Trans>Pending</Trans>
              </P>
            )) ||
              (amount && (
                <P size='s' weight='medium'>
                  {amount.toExact()} {amount.currency.symbol}
                </P>
              )) || (
                <P size='s' weight='medium'>
                  <Trans>Unknown</Trans>
                </P>
              )}
            {isExpandable && <StyledExpandIcon $isExpanded={isExpanded} color='grey-50' size='s' />}
          </Flex>
        </Flex>
      </StyledDetailsButton>
    </Flex>
  );
};

export { TransactionDetails };
