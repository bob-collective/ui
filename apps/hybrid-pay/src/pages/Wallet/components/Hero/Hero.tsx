import { Avatar, Button, Flex, H1, H2, Span, useCurrencyFormatter, useLocale } from '@gobob/ui';
import { usePrices } from '@gobob/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTotalBalance } from '../../../../hooks';
import { CHAIN, RoutesPath } from '../../../../constants';

type Props = {};

type HeroProps = Props;

const Hero = ({}: HeroProps): JSX.Element => {
  const { locale } = useLocale();
  const { data: accountBalance } = useTotalBalance(CHAIN);
  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const format = useCurrencyFormatter();

  const navigate = useNavigate();

  const handleSend = () => {
    navigate(RoutesPath.SEND);
  };

  const handleReceive = () => {
    navigate(RoutesPath.RECIEVE);
  };

  const accountBalanceSats = useMemo(
    () =>
      Intl.NumberFormat(locale).format(Math.round(accountBalance?.div(getPrice('WBTC') / 100000000).toNumber() || 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountBalance, locale]
  );

  return (
    <Flex direction='column' flex={1} gap='6xl' justifyContent='center' marginY='xl' paddingX='xl'>
      <Flex alignItems='center' direction='column' flex={1} justifyContent='center'>
        <H1 size='3xl' weight='bold'>
          {format(accountBalance?.toNumber() || 0)}
        </H1>
        <Flex alignItems='center' gap='md'>
          <Avatar
            size='2xl'
            src='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
          />
          <H2 color='grey-200' size='lg' weight='semibold'>
            {accountBalanceSats}{' '}
            <Span color='grey-200' size='md' weight='semibold'>
              SATS
            </Span>
          </H2>
        </Flex>
      </Flex>
      <Flex flex={1} gap='xl' justifyContent='center'>
        <Button fullWidth aria-label='navigate to send page' size='xl' onPress={handleSend}>
          Send
        </Button>
        <Button fullWidth aria-label='navigate to receive page' size='xl' onPress={handleReceive}>
          Receive
        </Button>
      </Flex>
    </Flex>
  );
};

export { Hero };
