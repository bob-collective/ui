import { Card, Dd, Divider, Dl, DlGroup, Dt, Flex, P, Skeleton, SolidClock, Span, Tooltip } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { LoginButton, SignUpButton } from '../../../../components';
import { SpiceChip } from '../SpiceChip';

type Props = { isAuthenticated?: boolean; roundEndsAt?: string; votesRemaining?: number };

type UserVotingInfoProps = Props;

const UserVotingInfo = ({ isAuthenticated, roundEndsAt, votesRemaining }: UserVotingInfoProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card borderColor='grey-300' direction='row' gap='md' padding={isAuthenticated ? 'xl' : 'lg'}>
      <>
        {isAuthenticated ? (
          <Dl>
            <DlGroup alignItems='center'>
              <Dt color='light' size='lg'>
                {t('apps.votingDashboard.votesLeft')}
              </Dt>
              <Dd>
                <SpiceChip hideTooltip isLit amount={votesRemaining || 0} />
              </Dd>
            </DlGroup>
          </Dl>
        ) : (
          <Flex alignItems='center' gap='md'>
            <LoginButton color='primary' size='s'>
              {t('apps.votingDashboard.login.cta')}
            </LoginButton>
            <Span color='grey-50' size='s'>
              {t('apps.votingDashboard.login.separator')}
            </Span>
            <SignUpButton color='primary' size='s' variant='ghost'>
              {t('apps.votingDashboard.login.createAccount')}
            </SignUpButton>
          </Flex>
        )}
        <Divider orientation='vertical' />
        <Tooltip label='Time left until voting round ends'>
          <Flex alignItems='center' gap='s'>
            <SolidClock color='grey-200' size='s' />
            {roundEndsAt ? <P>{formatDistanceToNow(roundEndsAt)}</P> : <Skeleton width='4xl' />}
          </Flex>
        </Tooltip>
      </>
    </Card>
  );
};

export { UserVotingInfo };
