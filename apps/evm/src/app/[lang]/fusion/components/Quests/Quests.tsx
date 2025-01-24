import { Flex, H2 } from '@gobob/ui';
import { I18n } from '@lingui/core';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { QuestCard, QuestCardProps } from './QuestCard';
import { StyledGrid, StyledWrapper } from './Quests.style';

const quests = (i18n: I18n): QuestCardProps[] => [
  {
    title: t(i18n)`BOB: The Home of Bitcoin DeFi`,
    description: t(i18n)`Participate in the event, learn, and get up to 10,000 Spice Points at the end of the event`,
    href: 'https://quest.intract.io/events/67642383b4c9cfdac86ea873',
    owner: 'intract'
  },
  {
    title: t(i18n)`BOB: The Home of Bitcoin DeFi`,
    description: t(i18n)`Total 10,000 Spice up for grabs`,
    href: 'https://app.layer3.xyz/campaigns/bob-x-babylon',
    owner: 'layer3'
  },
  {
    title: t(i18n)`Superchain Mastery: BOB`,
    description: t(i18n)`Discover BOB, the first hybrid Layer 2 in the Superchain!`,
    href: 'https://app.layer3.xyz/quests/superchain-mastery-bob',
    owner: 'layer3'
  }
];

type QuestsProps = {
  id: string;
};

const isComplete = true;

const Quests = ({ id }: QuestsProps) => {
  const { i18n } = useLingui();

  if (isComplete) return undefined;

  return (
    <Flex direction='column' gap='3xl' id={id} style={{ width: '100%' }}>
      <H2 align='center' size='3xl'>
        <Trans>Quests</Trans>
      </H2>
      <StyledWrapper>
        <StyledGrid gap='2xl'>
          {quests(i18n).map((strategy, idx) => (
            <QuestCard key={idx} {...strategy} />
          ))}
        </StyledGrid>
      </StyledWrapper>
    </Flex>
  );
};

export { Quests };
