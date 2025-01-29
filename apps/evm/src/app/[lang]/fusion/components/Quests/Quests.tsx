import { Flex, H2 } from '@gobob/ui';
import { I18n } from '@lingui/core';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { QuestCard, QuestCardProps } from './QuestCard';
import { StyledGrid, StyledWrapper } from './Quests.style';

const quests = (i18n: I18n): QuestCardProps[] => [
  {
    title: t(i18n)`CUBEs on BOB`,
    description: t(i18n)`CUBEs, a.k.a. Credentials to Unify Blockchain Events, are the new key to the Layer3 economy.`,
    href: 'https://app.layer3.xyz/quests/cubes-on-bob?slug=cubes-on-bob',
    owner: 'layer3'
  }
];

type QuestsProps = {
  id: string;
};

const Quests = ({ id }: QuestsProps) => {
  const { i18n } = useLingui();

  return (
    <Flex direction='column' gap='3xl' id={id} style={{ width: '100%' }}>
      <H2 align='center' size='3xl'>
        <Trans>Quests</Trans>
      </H2>
      <StyledWrapper>
        <StyledGrid gap={{ base: 'none', s: '2xl' }}>
          {quests(i18n).map((strategy, idx) => (
            <QuestCard key={idx} {...strategy} />
          ))}
        </StyledGrid>
      </StyledWrapper>
    </Flex>
  );
};

export { Quests };
