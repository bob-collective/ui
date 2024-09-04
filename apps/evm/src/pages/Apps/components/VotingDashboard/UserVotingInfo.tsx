import { Button, Card, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, P, Skeleton, SolidClock, Span } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';

import { SpiceChip } from '../SpiceChip';
import { LoginButton } from '../../../../components';
import { RoutesPath } from '../../../../constants';

type Props = { isAuthenticated?: boolean; roundEndsAt?: string; votesRemaining?: number };

type UserVotingInfoProps = Props;

const UserVotingInfo = ({ isAuthenticated, roundEndsAt, votesRemaining }: UserVotingInfoProps): JSX.Element => {
  return (
    <Card borderColor='grey-300' direction='row' gap='md' padding={isAuthenticated ? 'xl' : 'lg'}>
      <>
        {isAuthenticated ? (
          <Dl>
            <DlGroup alignItems='center'>
              <Dt color='light' size='lg'>
                Votes Left:
              </Dt>
              <Dd>
                <SpiceChip isLit amount={votesRemaining || 0} />
              </Dd>
            </DlGroup>
          </Dl>
        ) : (
          <Flex alignItems='center' gap='md'>
            <LoginButton color='primary' size='s'>
              Login
            </LoginButton>
            <Span color='grey-50' size='s'>
              or
            </Span>
            <Button asChild color='primary' size='s' variant='ghost'>
              <Link href={RoutesPath.SIGN_UP}>Create Account</Link>
            </Button>
          </Flex>
        )}
        <Divider orientation='vertical' />
        <Flex alignItems='center' gap='s'>
          <SolidClock color='grey-200' size='s' />
          {roundEndsAt ? <P>{formatDistanceToNow(roundEndsAt)}</P> : <Skeleton width='4xl' />}
        </Flex>
      </>
    </Card>
  );
};

export { UserVotingInfo };
