import { Avatar, Flex, FlexProps, P, Span, useLocale } from '@gobob/ui';
import { usePrices } from '@gobob/react-query';
import { truncateEthAddress } from '@gobob/utils';
import { formatDistanceToNow } from 'date-fns';

import { TransactionData } from '../../../../hooks';
import { calculateAmountUSD } from '../../../../utils';

import { StyledGrid } from './TransactionItem.style';

type Props = { transaction: TransactionData };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type TransactionItemProps = Props & InheritAttrs;

const TransactionItem = ({ transaction, ...props }: TransactionItemProps): JSX.Element => {
  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const { locale } = useLocale();

  const price = getPrice(transaction.amount.currency.symbol);

  const amountPrice =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 4 }).format(
      calculateAmountUSD(transaction.amount, price)
    );

  // const stasAmount = calculateSats(transaction.amount, price);

  return (
    <StyledGrid {...props}>
      <Flex alignItems='center' gap='md'>
        <Avatar size='3xl' src={transaction.tokenUrl} />
        <Flex direction='column'>
          <Span color={transaction.type === 'send' ? 'red-500' : 'green-500'} size='xs'>
            {transaction.type === 'send' ? '-' : '+'}
            {amountPrice}
          </Span>
          {/* {stasAmount && <Span size='xs'>{stasAmount}</Span>} */}
        </Flex>
      </Flex>
      <Flex alignItems='center'>
        <P size='xs'>{truncateEthAddress(transaction.type === 'receive' ? transaction.from : transaction.to)}</P>
      </Flex>
      <Flex alignItems='center'>
        <P size='xs'>{formatDistanceToNow(transaction.date)} ago</P>
      </Flex>
    </StyledGrid>
  );
};

export { TransactionItem };
