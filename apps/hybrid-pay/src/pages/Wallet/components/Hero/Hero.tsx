import { Button, Flex, H1, useLocale } from '@gobob/ui';
import { useNavigate } from 'react-router-dom';

import { useTotalBalance } from '../../../../hooks';
import { CHAIN, RoutesPath } from '../../../../constants';

type Props = {};

type HeroProps = Props;

const Hero = ({}: HeroProps): JSX.Element => {
  const { locale } = useLocale();
  const totalBalance = useTotalBalance(CHAIN);

  const navigate = useNavigate();

  const handleSend = () => {
    navigate(RoutesPath.SEND);
  };

  const handleReceive = () => {
    navigate(RoutesPath.RECEIVE);
  };

  return (
    <Flex direction='column' flex={1} gap='6xl' justifyContent='center' marginY='xl' paddingX='xl'>
      <Flex alignItems='center' direction='column' flex={1} justifyContent='center'>
        <H1 size='5xl' weight='bold'>
          {totalBalance
            ? Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(totalBalance?.toNumber())
            : '-'}
        </H1>
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
