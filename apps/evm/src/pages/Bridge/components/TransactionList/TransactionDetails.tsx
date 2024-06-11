import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { ArrowLongRight, Flex, FlexProps, P, UnstyledButton } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';

import { Chain } from '../../../../components';

import { StyledDetailsButton, StyledExpandIcon } from './TransactionList.style';

type Props = {
  type: 'deposit' | 'withdraw';
  date: Date;
  fromChainId: ChainId | 'BTC';
  toChainId: ChainId | 'BTC';
  amount: CurrencyAmount<Currency>;
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
  isExpanded,
  onExpand,
  ...props
}: TransactionDetailsProps): JSX.Element => {
  const direactionLabel = type === 'deposit' ? 'Deposit' : 'Withdraw';

  const isExpandable = !!onExpand;

  return (
    <Flex direction='column' {...props}>
      <Flex justifyContent='space-between'>
        <P color='grey-300' size='xs' weight='semibold'>
          {direactionLabel}
        </P>
        <P color='grey-300' size='xs' weight='semibold'>
          {formatDistanceToNow(date)} ago
        </P>
      </Flex>
      <StyledDetailsButton elementType={onExpand ? UnstyledButton : undefined} {...{ onPress: onExpand }}>
        <Flex wrap gap='s' justifyContent='space-between' style={{ width: '100%' }}>
          <Flex alignItems='center' gap='md'>
            <Chain chainId={fromChainId} iconProps={{ size: 'xs' }} labelProps={{ size: 's', weight: 'medium' }} />
            <ArrowLongRight color='grey-200' size='s' />
            <Chain chainId={toChainId} iconProps={{ size: 'xs' }} labelProps={{ size: 's', weight: 'medium' }} />
          </Flex>
          <Flex gap='md'>
            <P size='s' weight='medium'>
              {amount.toExact()} {amount.currency.symbol}
            </P>
            {isExpandable && <StyledExpandIcon $isExpanded={isExpanded} color='grey-100' size='s' />}
          </Flex>
        </Flex>
      </StyledDetailsButton>
    </Flex>
  );
};

export { TransactionDetails };
