import { CardProps, Flex } from '@gobob/ui';

import { ResultVotingAppData } from '../../hooks';

import { StyledCard, StyledContentWrapper, StyledGrid, StyledH2, StyledOpacityOverlay } from './AppsPodium.style';
import { PodiumSpot } from './PodiumSpot';

type Props = {
  apps: [ResultVotingAppData, ResultVotingAppData, ResultVotingAppData];
  isLoading?: boolean;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppPodiumProps = Props & InheritAttrs;

const AppsPodium = ({ apps, isLoading }: AppPodiumProps): JSX.Element => {
  const [first, second, third] = !isLoading ? apps : [undefined, undefined, undefined];

  return (
    <StyledCard borderColor='grey-300' marginTop='4xl' padding='none'>
      <StyledOpacityOverlay />
      <StyledContentWrapper
        alignItems='center'
        direction={{ base: 'column', md: 'row' }}
        gap='3xl'
        justifyContent='space-between'
        padding={{ base: '3xl', md: '5xl' }}
      >
        <StyledH2 align={{ base: 'center', md: 'start' }} size={{ base: '2xl', md: '4xl' }}>
          Last Week&apos;s Winners
        </StyledH2>
        <Flex flex={1} justifyContent='center'>
          <StyledGrid>
            <PodiumSpot app={second} spot='second' />
            <PodiumSpot app={first} marginLeft={{ base: 'md', md: '2xl' }} spot='first' />
            <PodiumSpot app={third} marginLeft={{ base: 'xxs', md: 'lg' }} spot='third' />
          </StyledGrid>
        </Flex>
      </StyledContentWrapper>
    </StyledCard>
  );
};

export { AppsPodium };
