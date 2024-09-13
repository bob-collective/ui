import { CardProps, Flex } from '@gobob/ui';

import { ResultVotingAppData } from '../../hooks/useGetPodyumData';

import { StyledCard, StyledContentWrapper, StyledGrid, StyledH2, StyledOpacityOverlay } from './AppsPodyum.style';
import { PodyumSpot } from './PodyumSpot';

type Props = {
  apps?: [ResultVotingAppData, ResultVotingAppData, ResultVotingAppData];
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppPodyumProps = Props & InheritAttrs;

const AppsPodyum = ({ apps }: AppPodyumProps): JSX.Element => {
  const [first, second, third] = apps || [undefined, undefined, undefined];

  return (
    <StyledCard borderColor='grey-300' marginTop='3xl' padding='none'>
      <StyledOpacityOverlay />
      <StyledContentWrapper
        alignItems='center'
        direction={{ base: 'column', md: 'row' }}
        gap='3xl'
        justifyContent='space-between'
        padding={{ base: '3xl', md: '5xl' }}
      >
        <StyledH2 align={{ base: 'center', md: 'start' }} size={{ base: '2xl', md: '4xl' }}>
          Previous Voting Round Winners
        </StyledH2>
        <Flex flex={1} justifyContent='center'>
          <StyledGrid>
            <PodyumSpot app={second} spot='second' />
            <PodyumSpot app={first} marginLeft={{ base: 'md', md: '2xl' }} spot='first' />
            <PodyumSpot app={third} marginLeft={{ base: 'xxs', md: 'lg' }} spot='third' />
          </StyledGrid>
        </Flex>
      </StyledContentWrapper>
    </StyledCard>
  );
};

export { AppsPodyum };
