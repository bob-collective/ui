import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { ArrowLongRight, Flex, FlexProps, P, UnstyledButton } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';

import { Type } from '../../Bridge';

import { StyledDetailsButton, StyledExpandIcon } from './TransactionList.style';

import { Chain } from '@/components';

type Props = {
  type: Type;
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
  type,
  date,
  fromChainId,
  toChainId,
  amount,
  isPending,
  isExpanded,
  onExpand,
  ...props
}: TransactionDetailsProps): JSX.Element => {
  const directionLabel = type === Type.Deposit ? 'Deposit' : 'Withdraw';

  const isExpandable = !!onExpand;

  return (
    <Flex direction='column' {...props}>
      <Flex justifyContent='space-between'>
        <P color='grey-50' size='xs' weight='semibold'>
          {directionLabel}
        </P>
        <P color='grey-50' size='xs' weight='semibold'>
          {formatDistanceToNow(date)} ago
        </P>
      </Flex>
      <StyledDetailsButton elementType={onExpand ? UnstyledButton : undefined} {...{ onPress: onExpand }}>
        <Flex wrap gap='s' justifyContent='space-between' style={{ width: '100%' }}>
          <Flex alignItems='center' gap='md'>
            <Chain chainId={fromChainId} iconProps={{ size: 'xs' }} labelProps={{ size: 's', weight: 'medium' }} />
            <ArrowLongRight color='grey-50' size='s' />
            <Chain chainId={toChainId} iconProps={{ size: 'xs' }} labelProps={{ size: 's', weight: 'medium' }} />
          </Flex>
          <Flex gap='md'>
            {(isPending && (
              <P size='s' weight='medium'>
                Pending
              </P>
            )) ||
              (amount && (
                <P size='s' weight='medium'>
                  {amount.toExact()} {amount.currency.symbol}
                </P>
              )) || (
                <P size='s' weight='medium'>
                  Unknown
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
