import { Button, Chip, Flex, H2, Link, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';

import { QuestS3Response } from '../../../../utils';

import { StyledCard, StyledDescription, StyledIntract, StyledOpacityOverlay } from './Quest.style';

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
            {formatDistanceToNow(intractQuest.end_date)} until quest ends
          </Chip>
        ) : (
          <Skeleton height='3xl' width='9xl' />
        )}
        <H2 size='3xl'>Quest</H2>
        {intractQuest ? (
          <StyledDescription dangerouslySetInnerHTML={{ __html: intractQuest.description }} />
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
          View Quest
        </Button>
      </Flex>
    </Flex>
  );
};

export { Quest };
