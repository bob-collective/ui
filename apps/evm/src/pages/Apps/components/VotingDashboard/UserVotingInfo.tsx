import { Button, Card, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, P, Skeleton, SolidClock, Span } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';

import { SpiceChip } from '../SpiceChip';
import { useGetUser } from '../../../../hooks';
import { LoginButton } from '../../../../components';
import { RoutesPath } from '../../../../constants';

type Props = { roundEndsAt?: string; votesRemaining?: number };

type UserVotingInfoProps = Props;

const UserVotingInfo = ({ roundEndsAt, votesRemaining }: UserVotingInfoProps): JSX.Element => {
  const { data: user } = useGetUser();

  return (
    <Card borderColor='grey-300' direction='row' gap='md' padding='xl'>
      {user ? (
        <>
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
          <Divider orientation='vertical' />
          <Flex alignItems='center' gap='s'>
            <SolidClock color='grey-200' size='s' />
            {roundEndsAt ? <P>{formatDistanceToNow(new Date())}</P> : <Skeleton width='4xl' />}
          </Flex>{' '}
        </>
      ) : (
        <>
          <Flex alignItems='center' gap='md'>
            <LoginButton color='primary'>Login</LoginButton>
            <Span color='grey-50' size='s'>
              or
            </Span>
            <Button asChild color='primary' variant='ghost'>
              <Link href={RoutesPath.SIGN_UP}>Create Account</Link>
            </Button>
          </Flex>
        </>
      )}
    </Card>
  );
};

export { UserVotingInfo };
