import { Button, Chip, Flex, H2, Link, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';
import { Trans } from '@lingui/macro';

import { StyledCard, StyledDescription, StyledIntract, StyledOpacityOverlay } from './Quest.style';

import { QuestS3Response } from '@/utils';

type QuestProps = { quests: QuestS3Response | undefined; id: string };

const Quest = ({ id, quests }: QuestProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const [intractQuest] = quests?.questBreakdown || [];

  return (
    <Flex direction={{ base: 'column-reverse', s: 'row-reverse' }} gap='3xl' id={id} marginTop='8xl'>
      {!isMobile && (
        <StyledCard borderColor='grey-300' flex={0.4}>
          <StyledOpacityOverlay />
          <StyledIntract />
        </StyledCard>
      )}
      <Flex
        alignItems={false ? 'flex-start' : undefined}
        direction='column'
        flex={1.6}
        gap='lg'
        marginY={{ base: 'none', s: 'md', md: '4xl' }}
      >
        {intractQuest ? (
          <Chip startAdornment={<SolidClock size='s' />}>
            <Trans>{formatDistanceToNow(intractQuest.end_date)} until quest ends</Trans>
          </Chip>
        ) : (
          <Skeleton height='3xl' width='9xl' />
        )}
        <H2 size='3xl'>
          <Trans>Quests</Trans>
        </H2>
        {intractQuest ? (
          <StyledDescription>
            <Trans>
              Complete a variety of on- and off-chain quests using Intract and the BOB Stake Portal to harvest an
              additional 62,500 Spice.
            </Trans>
          </StyledDescription>
        ) : (
          <Skeleton count={3} height='xl' />
        )}
        <Button
          elementType={Link}
          size='xl'
          style={{ alignSelf: 'flex-start' }}
          variant='outline'
          {...{ external: true, href: intractQuest?.url, disabled: !intractQuest }}
        >
          <Trans>View Quests</Trans>
        </Button>
      </Flex>
    </Flex>
  );
};

export { Quest };
