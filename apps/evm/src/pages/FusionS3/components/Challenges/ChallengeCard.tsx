import { Button, CardProps, Link, P } from '@gobob/ui';
import { Galxe, Intract, Spice } from '@gobob/icons';

import { QuestRefCodes } from '../../../../utils';

import { StyledAvatarWrapper, StyledCard, StyledCubsPath, StyledPrize, StyledQuestWrapper } from './Challenges.style';

const questOwnerMap = {
  [QuestRefCodes.GALXE]: Galxe,
  [QuestRefCodes.INTRACT]: Intract
};

type Props = {
  href: string;
  description: string;
  prize: string;
  questRefCode: QuestRefCodes;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type ChallengeCardProps = Props & InheritAttrs;

const ChallengeCard = ({ description, href, prize, questRefCode, ...props }: ChallengeCardProps) => {
  const QuestOwnerComp = questOwnerMap[questRefCode];

  return (
    <div {...props}>
      <StyledCard gap='xl' marginX='s'>
        <StyledAvatarWrapper>
          <StyledCubsPath />
          <StyledQuestWrapper>
            <QuestOwnerComp size='4xl' />
          </StyledQuestWrapper>
          <StyledPrize rounded='s' startAdornment={<Spice color='primary-500' size='xs' />}>
            {prize}
          </StyledPrize>
        </StyledAvatarWrapper>
        <P align='center'>{description}</P>
        <Button asChild variant='outline'>
          <Link external href={href}>
            View Challenge
          </Link>
        </Button>
      </StyledCard>
    </div>
  );
};

export { ChallengeCard };
