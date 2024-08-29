import { H1, P } from '@gobob/ui';

import { StyledCard, StyledContentWrapper, StyledOpacityOverlay } from './HeroBanner.style';

const HeroBanner = (): JSX.Element => {
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
          BOB Leaderboard Competition
        </H1>
        <P align={{ base: 'center', md: 'start' }} size={{ base: 'xs', md: 'md' }} style={{ maxWidth: 500 }}>
          Cast your daily vote for your favorite projects to earn Lottery tickets and increase your spice rewards.
        </P>
      </StyledContentWrapper>
    </StyledCard>
  );
};

export { HeroBanner };
