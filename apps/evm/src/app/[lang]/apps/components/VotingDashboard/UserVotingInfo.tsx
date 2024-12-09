import { Card, Dd, Divider, Dl, DlGroup, Dt, Flex, P, Skeleton, SolidClock, Span, Tooltip } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { Trans } from '@lingui/macro';
import { useParams } from 'next/navigation';

import { SpiceChip } from '../SpiceChip';

import { LoginButton, SignUpButton } from '@/components';
import { getLocale } from '@/utils';

type Props = { isAuthenticated?: boolean; roundEndsAt?: string; votesRemaining?: number };

type UserVotingInfoProps = Props;

const UserVotingInfo = ({ isAuthenticated, roundEndsAt, votesRemaining }: UserVotingInfoProps): JSX.Element => {
  const { lang } = useParams();

  return (
    <Card borderColor='grey-300' direction='row' gap='md' padding={isAuthenticated ? 'xl' : 'lg'}>
      <>
        {isAuthenticated ? (
          <Dl>
            <DlGroup alignItems='center'>
              <Dt color='light' size='lg'>
                <Trans>Votes Left:</Trans>
              </Dt>
              <Dd>
                <SpiceChip hideTooltip isLit amount={votesRemaining || 0} />
              </Dd>
            </DlGroup>
          </Dl>
        ) : (
          <Flex alignItems='center' gap='md'>
            <LoginButton color='primary' size='s'>
              <Trans>Log in</Trans>
            </LoginButton>
            <Span color='grey-50' size='s'>
              <Trans>or</Trans>
            </Span>
            <SignUpButton color='primary' size='s' variant='ghost'>
              <Trans>Create Account</Trans>
            </SignUpButton>
          </Flex>
        )}
        <Divider orientation='vertical' />
        <Tooltip label={<Trans>Time left until voting round ends</Trans>}>
          <Flex alignItems='center' gap='s'>
            <SolidClock color='grey-200' size='s' />
            {roundEndsAt ? (
              <P>
                {formatDistanceToNow(roundEndsAt, {
                  locale: getLocale(lang as Parameters<typeof getLocale>[0])
                })}
              </P>
            ) : (
              <Skeleton width='4xl' />
            )}
          </Flex>
        </Tooltip>
      </>
    </Card>
  );
};

export { UserVotingInfo };
