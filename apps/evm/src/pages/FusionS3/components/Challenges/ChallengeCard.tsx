import { Galxe, Intract, Spice } from '@gobob/icons';
import { Flex, H3, Skeleton, useLocale } from '@gobob/ui';

import { QuestBreakdown, QuestRefCodes } from '../../../../utils';

import {
  StyledAvatarWrapper,
  StyledCard,
  StyledCompletedTag,
  StyledCubsPath,
  StyledDescription,
  StyledOpacityOverlay,
  StyledPrize,
  StyledQuestWrapper
} from './Challenges.style';

const questOwnerMap = {
  [QuestRefCodes.GALXE]: Galxe,
  [QuestRefCodes.INTRACT]: Intract
};

type Props = {
  data?: QuestBreakdown;
};

type ChallengeCardProps = Props;

const ChallengeCard = ({ data, ...props }: ChallengeCardProps) => {
  const { locale } = useLocale();
  const QuestOwnerComp = data?.questing_platform_referral_code
    ? questOwnerMap[data?.questing_platform_referral_code as QuestRefCodes]
    : undefined;

  return (
    <a {...props} href={data?.url || '#'} rel='noreferrer' style={{ textDecoration: 'none' }} target='_blank'>
      <StyledCard isHoverable isPressable gap='xl' marginX='s'>
        {data?.quest_completed && <StyledOpacityOverlay />}
        <StyledAvatarWrapper>
          {data?.quest_completed && (
            <StyledCompletedTag size='xl' weight='bold'>
              Completed
            </StyledCompletedTag>
          )}
          <StyledCubsPath />
          {QuestOwnerComp && (
            <StyledQuestWrapper>
              <QuestOwnerComp size='4xl' />
            </StyledQuestWrapper>
          )}
          {!!data?.available_spice && (
            <StyledPrize rounded='s'>
              <Flex alignItems='center' gap='xs'>
                <Spice size='xs' />
                {Intl.NumberFormat(locale).format(Number(data.available_spice))}
              </Flex>
            </StyledPrize>
          )}
        </StyledAvatarWrapper>
        {data ? (
          <H3 rows={1} size='md'>
            {data.quest_name}
          </H3>
        ) : (
          <Skeleton width='50%' />
        )}
        {data ? (
          <StyledDescription dangerouslySetInnerHTML={{ __html: data.description }} />
        ) : (
          <Skeleton count={2} height='xl' />
        )}
      </StyledCard>
    </a>
  );
};

export { ChallengeCard };
