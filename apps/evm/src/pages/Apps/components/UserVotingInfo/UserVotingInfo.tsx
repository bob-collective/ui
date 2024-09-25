import {
  Button,
  Card,
  CardProps,
  Dd,
  Divider,
  Dl,
  DlGroup,
  Dt,
  Flex,
  Link,
  P,
  Skeleton,
  SolidClock,
  Span,
  Tooltip
} from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import { LoginButton } from '../../../../components';
import { RoutesPath } from '../../../../constants';
import { VotingAppsData } from '../../hooks';
import { SpiceChip } from '../SpiceChip';

type Props = { isAuthenticated?: boolean; apps?: VotingAppsData };

type InheritAttrs = Omit<CardProps, keyof Props>;

type UserVotingInfoProps = Props & InheritAttrs;

const UserVotingInfo = ({ isAuthenticated, apps, ...props }: UserVotingInfoProps): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Card borderColor='grey-300' direction='row' gap='md' padding={isAuthenticated ? 'xl' : 'lg'} {...props}>
      <>
        {isAuthenticated ? (
          <Dl>
            <DlGroup alignItems='center'>
              <Dt color='light' size='lg'>
                Votes Left:
              </Dt>
              <Dd>
                <SpiceChip hideTooltip isLit amount={votesRemaining || 0} />
              </Dd>
            </DlGroup>
          </Dl>
        ) : (
          <Flex alignItems='center' gap='md'>
            <LoginButton color='primary' size='s'>
              Log in
            </LoginButton>
            <Span color='grey-50' size='s'>
              or
            </Span>
            <Button asChild color='primary' size='s' variant='ghost'>
              <Link href={RoutesPath.SIGN_UP} {...{ state: { redirect: RoutesPath.APPS } }}>
                Create Account
              </Link>
            </Button>
          </Flex>
        )}
        <Divider orientation='vertical' />
        <Tooltip label='Time left until voting round ends'>
          <Flex alignItems='center' gap='s'>
            <SolidClock color='grey-200' size='s' />
            {apps?.roundEndsAt ? <P>{formatDistanceToNow(apps.roundEndsAt)}</P> : <Skeleton width='4xl' />}
          </Flex>
        </Tooltip>
      </>
    </Card>
  );
};

export { UserVotingInfo };
