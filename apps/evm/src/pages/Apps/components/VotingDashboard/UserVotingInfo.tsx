import { Card, Dd, Divider, Dl, DlGroup, Dt, Flex, P, SolidClock } from '@gobob/ui';

import { VotingChip } from '../VotingChip';

type Props = {};

type UserVotingInfoProps = Props;

const UserVotingInfo = ({}: UserVotingInfoProps): JSX.Element => {
  return (
    <Card borderColor='grey-300' direction='row' gap='md' padding='xl'>
      <Dl>
        <DlGroup alignItems='center'>
          <Dt color='light' size='lg'>
            Votes Left:
          </Dt>
          <Dd>
            <VotingChip isLit>1</VotingChip>
          </Dd>
        </DlGroup>
      </Dl>
      <Divider orientation='vertical' />
      <Flex alignItems='center' gap='s'>
        <SolidClock color='grey-200' size='s' />
        <P>12h 43m</P>
      </Flex>
    </Card>
  );
};

export { UserVotingInfo };
