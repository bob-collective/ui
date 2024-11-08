import { Avatar, Flex, FlexProps, P, Span, useLocale } from '@gobob/ui';
import { usePrices } from '@gobob/react-query';
import { truncateEthAddress } from '@gobob/utils';
import { format } from 'date-fns';

import { StyledAvatarAdornment, StyledAvatarWrapper } from './TransactionItem.style';

import { TransactionData } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type Props = { transaction: TransactionData };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type TransactionItemProps = Props & InheritAttrs;

const TransactionItem = ({ transaction, ...props }: TransactionItemProps): JSX.Element => {
  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });
  const { locale } = useLocale();

  const price = getPrice(transaction.amount.currency.symbol);

  const amountPrice =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 4,
      minimumFractionDigits: 2,
      notation: 'compact'
    }).format(calculateAmountUSD(transaction.amount, price));

  const symbol = transaction.type === 'send' ? '-' : '+';

  return (
    <Flex alignItems='center' justifyContent='space-between' {...props}>
      <Flex gap='lg'>
        <Flex alignItems='center' gap='md'>
          <StyledAvatarWrapper>
            <Avatar size='4xl' src={transaction.tokenUrl} />
            <StyledAvatarAdornment type={transaction.type} />
          </StyledAvatarWrapper>
        </Flex>
        <Flex direction='column'>
          <P size='s'>{truncateEthAddress(transaction.type === 'receive' ? transaction.from : transaction.to)}</P>
          <P color='grey-200' size='xs' weight='semibold'>
            {format(transaction.date, 'MMM d, k:m')}
          </P>
        </Flex>
      </Flex>
      <Span color={transaction.type === 'send' ? 'red-500' : 'green-500'} size='md' weight='semibold'>
        {symbol}
        {amountPrice}
      </Span>
    </Flex>
  );
};

export { TransactionItem };
