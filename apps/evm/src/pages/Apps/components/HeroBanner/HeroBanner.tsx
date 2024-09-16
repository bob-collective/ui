import { H1, P } from '@gobob/ui';
import { useState } from 'react';

import { VotingInfoModal } from './VotingInfoModal';
import { StyledButton, StyledCard, StyledContentWrapper, StyledOpacityOverlay } from './HeroBanner.style';

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
          Community Voting {' '}
        </H1>
        <P align={{ base: 'center', md: 'start' }} size={{ base: 'xs', md: 'md' }} style={{ maxWidth: 700 }}>
          You can now vote with your SPICE. Each user receives three votes to support their favorite apps. Winners will
          be announced every two weeks.{' '}
          <StyledButton size='inherit' onPress={() => setOpen(true)}>
            Read more here
          </StyledButton>
          <VotingInfoModal isOpen={isOpen} onClose={() => setOpen(false)} />
        </P>
      </StyledContentWrapper>
    </StyledCard>
  );
};

export { HeroBanner };
