'use client';

import { Button, Flex, H1, Link, useLocale } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { CHAIN, RoutesPath } from '@/constants';
import { useTotalBalance } from '@/hooks';

const Hero = (): JSX.Element => {
  const { locale } = useLocale();
  const totalBalance = useTotalBalance(CHAIN);

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
        <Button fullWidth elementType={Link} size='xl' {...{ href: RoutesPath.SEND }}>
          <Trans>Send</Trans>
        </Button>
        <Button fullWidth elementType={Link} size='xl' {...{ href: RoutesPath.RECEIVE }}>
          <Trans>Receive</Trans>
        </Button>
      </Flex>
    </Flex>
  );
};

export { Hero };
