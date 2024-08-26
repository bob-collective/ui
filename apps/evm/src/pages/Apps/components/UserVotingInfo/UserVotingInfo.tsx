import { Card, Divider, Flex, H2, P, SolidClock } from '@gobob/ui';

import { VotingChip } from '../VotingChip';

type Props = {};

type UserVotingInfoProps = Props;

const UserVotingInfo = ({}: UserVotingInfoProps): JSX.Element => {
  return (
    <Card borderColor='grey-300' direction='row' gap='md'>
      <H2 size='xl'>
        Votes Left: <VotingChip isLit>1</VotingChip>
      </H2>
      <Divider orientation='vertical' />
      <Flex alignItems='center' gap='s'>
        <SolidClock color='grey-200' size='s' />
        <P>12h 43m</P>
      </Flex>
    </Card>
  );
};

export { UserVotingInfo };
