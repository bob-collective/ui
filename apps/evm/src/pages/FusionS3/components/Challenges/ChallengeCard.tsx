import { Galxe, Intract, Spice } from '@gobob/icons';
import { H3, Skeleton } from '@gobob/ui';

import { QuestBreakdown, QuestRefCodes } from '../../../../utils';

import {
  StyledAvatarWrapper,
  StyledCard,
  StyledCubsPath,
  StyledDescription,
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
  const QuestOwnerComp = questOwnerMap[QuestRefCodes.GALXE];

  const card = (
    <StyledCard isHoverable isPressable gap='xl' marginX='s'>
      <StyledAvatarWrapper>
        <StyledCubsPath />
        <StyledQuestWrapper>
          <QuestOwnerComp size='4xl' />
        </StyledQuestWrapper>
        <StyledPrize rounded='s' startAdornment={<Spice color='primary-500' size='xs' />}>
          {20000}
        </StyledPrize>
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
  );

  if (!data) {
    return card;
  }

  return (
    <a {...props} href={data.url} rel='noreferrer' style={{ textDecoration: 'none' }} target='_blank'>
      {card}
    </a>
  );
};

export { ChallengeCard };
