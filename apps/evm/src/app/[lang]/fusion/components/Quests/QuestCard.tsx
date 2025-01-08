import { Flex, H3, P } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { QuestOwner, QuestOwnerIcon } from '../QuestOwnerAvatar';

import { StyledBanner, StyledBannerWrapper, StyledCard } from './Quests.style';

type Props = {
  title: string;
  description: string;
  owner: QuestOwner;
  href: string;
};

type QuestCardProps = Props;

const QuestCard = ({ title, description, owner, href }: QuestCardProps) => {
  const { i18n } = useLingui();

  return (
    <StyledCard
      isHoverable
      isPressable
      aria-label={t(i18n)`navigate to ${owner} quest: ${title}`}
      direction='row'
      flex={1}
      padding='none'
      onPress={() => window.open(href, '_blank', 'noreferrer')}
    >
      <StyledBannerWrapper flex={1}>
        <StyledBanner
          alignItems='center'
          justifyContent='center'
          rounded='none'
          style={{ overflow: 'hidden', background: 'linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))' }}
        >
          <QuestOwnerIcon name={owner} size='3xl' />
        </StyledBanner>
      </StyledBannerWrapper>
      <Flex direction='column' flex={2} gap='s' justifyContent='center' padding='lg'>
        <H3 rows={1} size='md'>
          {title}
        </H3>
        <P color='grey-50' rows={3} size='s'>
          {description}
        </P>
      </Flex>
    </StyledCard>
  );
};

export { QuestCard };
export type { QuestCardProps };
