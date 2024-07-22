import { Button, Flex, H1, useLocale } from '@gobob/ui';
import { useNavigate } from 'react-router-dom';

import { useTotalBalance } from '../../../../hooks';
import { CHAIN, RoutesPath } from '../../../../constants';

type Props = {};

type HeroProps = Props;

const Hero = ({}: HeroProps): JSX.Element => {
  const { locale } = useLocale();
  const { data: accountBalance } = useTotalBalance(CHAIN);

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
        {/* {isPending ? (
          <Skeleton
            baseColor='rgba(255, 255, 255, 0.13)'
            height='3.75rem'
            highlightColor='rgba(255, 255, 255, 0.13)'
            width={150}
          />
        ) : ( */}
        <H1 size='5xl' weight='bold'>
          {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(accountBalance?.toNumber() || 0)}
        </H1>
        {/* )} */}
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
