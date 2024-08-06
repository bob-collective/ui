import { Card, Flex, P, Link, Alert } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import { useGetUser } from '../../../../hooks';
import { LoginSignUp } from '../LoginSignUp';
import { ProjectStatus } from '../ProjectStatus';
import { UserStats } from '../UserStats';
import { useHaltedLockedTokens } from '../../hooks';

const Dashboard = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { t } = useTranslation();

  const isAuthenticated = !!address && !!user;

  const { data: haltedLockedTokens } = useHaltedLockedTokens();

  const hasAlex = useMemo(() => haltedLockedTokens?.find((token) => token.raw.symbol === 'ALEX'), [haltedLockedTokens]);

  return (
    <Flex direction='column' gap='xl' marginTop='3xl'>
      <Alert status='info' variant='outlined'>
        {hasAlex ? (
          <P size='s' weight='semibold'>
            Due to an exploit involving the XLink bridge, Alex Lab has disabled bridging and withdrawing ALEX. You can
            migrate the ALEX tokens that you have in Fusion Season 1 to ALEX V2. For additional details see the{' '}
            <Link external href='https://x.com/ALEXLabBTC/status/1790815791832498291' size='inherit'>
              announcement from ALEX Lab
            </Link>
            .
          </P>
        ) : (
          <P size='s' weight='semibold'>
            {t('fusion.spiceWaitTime')}
          </P>
        )}
      </Alert>
      <Flex direction={{ base: 'column', md: 'row' }} gap='3xl'>
        <Card flex={0.55} gap='lg' padding='3xl'>
          <ProjectStatus />
        </Card>
        <Card flex={0.45} style={{ minHeight: '14.375rem' }}>
          {isAuthenticated ? <UserStats /> : <LoginSignUp />}
        </Card>
      </Flex>
    </Flex>
  );
};

export { Dashboard };
