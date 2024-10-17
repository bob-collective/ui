'use client';

import { H1 } from '@gobob/ui';
import { useState } from 'react';
import { Trans } from '@lingui/macro';

import { VotingInfoModal } from './VotingInfoModal';
import {
  StyledButton,
  StyledCard,
  StyledContentWrapper,
  StyledDescription,
  StyledOpacityOverlay
} from './HeroBanner.style';

const HeroBanner = (): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  return (
    <StyledCard borderColor='grey-300' padding='none'>
      <StyledOpacityOverlay />
      <StyledContentWrapper
        alignItems={{ base: 'center', md: 'flex-start' }}
        direction='column'
        gap='lg'
        padding={{ base: '3xl', s: '5xl', md: '7xl' }}
      >
        <H1 align={{ base: 'center', md: 'start' }} size={{ base: '2xl', md: '4xl' }}>
          <Trans>Community Voting  </Trans>
        </H1>
        <StyledDescription align={{ base: 'center', md: 'start' }} color='grey-50' size={{ base: 'xs', md: 'md' }}>
          <Trans>
            Use your Spice total to support your favourite BOB builders. Winners will be announced each week.
          </Trans>{' '}
          <StyledButton size='inherit' onPress={() => setOpen(true)}>
            <Trans>Read more here</Trans>
          </StyledButton>
          <VotingInfoModal isOpen={isOpen} onClose={() => setOpen(false)} />
        </StyledDescription>
      </StyledContentWrapper>
    </StyledCard>
  );
};

export { HeroBanner };
