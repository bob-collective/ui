import { Button, Chip, Flex, H2, Link, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';
import { t, Trans } from '@lingui/macro';
import { useIsClient } from 'usehooks-ts';
import Image from 'next/image';
import { useLingui } from '@lingui/react';
import welcomeSeason3 from '@public/assets/welcome-season-3.jpg';

import { StyledCard, StyledDescription, StyledIntract, StyledOpacityOverlay } from './Quest.style';

import { QuestS3Response } from '@/utils';

type QuestProps = { quests: QuestS3Response | undefined; id: string };

const Quest = ({ id, quests }: QuestProps) => {
  const theme = useTheme();
  const isClient = useIsClient();

  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const { i18n } = useLingui();

  const [intractQuest] = quests?.questBreakdown || [];

  const isActive = intractQuest?.is_active;

  return (
    <Flex direction={{ base: 'column-reverse', s: 'row-reverse' }} gap='3xl' id={id} marginTop='8xl'>
      {isClient && !isMobile && (
        <StyledCard borderColor='grey-300' flex={0.4}>
          <Image
            fill
            alt={t(i18n)`Welcome season 3`}
            placeholder='blur'
            quality={100}
            sizes='100vw'
            src={welcomeSeason3}
            style={{
              objectFit: 'cover'
            }}
          />
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
            {isActive ? (
              <Trans>{formatDistanceToNow(intractQuest.end_date)} until quest ends</Trans>
            ) : (
              <Trans>Coming Soon</Trans>
            )}
          </Chip>
        ) : (
          <Skeleton height='3xl' width='9xl' />
        )}
        {intractQuest ? (
          <H2 size='3xl'>{isActive ? <Trans>Quests</Trans> : <Trans>New Quests Coming Soon</Trans>}</H2>
        ) : (
          <Skeleton count={1} height='xl' width='50%' />
        )}
        {intractQuest ? (
          <StyledDescription>
            {isActive ? (
              <Trans>
                Complete a variety of on- and off-chain quests using Intract and the BOB Stake Portal to harvest an
                additional 62,500 Spice.
              </Trans>
            ) : (
              <Trans>
                The previous quest has ended. Stay tuned for more exciting quests with Intract and BOB Stake. More
                rewards are on the way!
              </Trans>
            )}
          </StyledDescription>
        ) : (
          <Skeleton count={2} height='xl' />
        )}
        {intractQuest ? (
          <Button
            elementType={Link}
            size='xl'
            style={{ alignSelf: 'flex-start' }}
            variant='outline'
            {...{ external: true, href: intractQuest?.url, disabled: !intractQuest }}
          >
            {isActive ? <Trans>View Quests</Trans> : <Trans>View Intract</Trans>}
          </Button>
        ) : (
          <Skeleton count={1} height='5xl' width='10xl' />
        )}
      </Flex>
    </Flex>
  );
};

export { Quest };
