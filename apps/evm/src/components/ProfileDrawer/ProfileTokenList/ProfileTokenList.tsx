import { Avatar, Flex, P, useCurrencyFormatter } from '@gobob/ui';
import { usePrices } from '@gobob/hooks';
import { BOBLogo } from '@gobob/icons';

import { StyledTransactionList, StyledTransactionListWrapper } from './ProfileTokenList.style';

import { useBalances, useTokens } from '@/hooks';
import { L2_CHAIN } from '@/constants';
import { calculateAmountUSD } from '@/utils';

const ProfileTokenList = (): JSX.Element => {
  const { data: tokens } = useTokens(L2_CHAIN);
  const { getBalance } = useBalances(L2_CHAIN);
  const format = useCurrencyFormatter();

  const { getPrice } = usePrices();

  const list = tokens
    ?.map((token) => ({ token, balance: getBalance(token.currency.symbol) }))
    .filter((item) => item.balance?.greaterThan(0));

  return (
    <StyledTransactionListWrapper direction='column' flex={1} paddingX='s'>
      <StyledTransactionList direction='column' flex={1} gap='xl' paddingY='xl'>
        {list?.map((item) => (
          <Flex key={item.token.raw.address} alignItems='center' justifyContent='space-between'>
            <Flex alignItems='center' gap='lg'>
              <div style={{ position: 'relative' }}>
                <Avatar alt={item.token.raw.name} size='5xl' src={item.token.raw.logoUrl} />
                <BOBLogo size='xs' style={{ position: 'absolute', bottom: 0, right: 0 }} />
              </div>
              <Flex direction='column'>
                <P rows={1}>{item.token.raw.name}</P>
                <P color='grey-50' rows={1} size='s'>
                  {item.balance?.toSignificant()} {item.token.currency.symbol} (
                  {format(calculateAmountUSD(item.balance!, getPrice(item.balance!.currency.symbol)))})
                </P>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </StyledTransactionList>
    </StyledTransactionListWrapper>
  );
};

export { ProfileTokenList };
