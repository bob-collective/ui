import { Card, Flex, InformationCircle, P } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useTranslation } from 'react-i18next';

import { useGetUser } from '../../../../hooks';
import { LoginSignUp } from '../LoginSignUp';
import { StyledCard } from '../PartnersSection/PartnerCard.style';
import { ProjectStatus } from '../ProjectStatus';
import { UserStats } from '../UserStats';

const Dashboard = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { t } = useTranslation();

  const isAuthenticated = !!address && !!user;

  return (
    <Flex direction='column' gap='xl' marginTop='3xl'>
      <StyledCard alignItems='center' direction='row' gap='md'>
        <InformationCircle />
        <P size='s' weight='semibold'>
          {t('fusion.spiceWaitTime')}
        </P>
      </StyledCard>
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
