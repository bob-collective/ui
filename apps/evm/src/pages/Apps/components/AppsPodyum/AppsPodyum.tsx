import { CardProps, Flex, H2, P } from '@gobob/ui';

import { StyledCard, StyledContentWrapper, StyledOpacityOverlay } from './AppsPodyum.style';
import { PodyumSpot } from './PodyumSpot';

type App = { name: string; imgSrc: string };

type Props = {
  apps: [App, App, App];
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppPodyumProps = Props & InheritAttrs;

const AppsPodyum = ({ apps }: AppPodyumProps): JSX.Element => {
  const [first, second, third] = apps;

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
        <Flex direction='column' flex={1}>
          <H2 align={{ base: 'center', md: 'start' }} size={{ base: '2xl', md: '4xl' }}>
            Last Weeks Top Apps
          </H2>
          <P align={{ base: 'center', md: 'start' }} size={{ base: 's', md: 'md' }}>
            Lorem Ipsum Dummy Text - TBA
          </P>
        </Flex>
        <Flex flex={1} justifyContent='center'>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', alignItems: 'end', maxWidth: '21rem' }}>
            <PodyumSpot app={second} spot='second' />
            <PodyumSpot app={first} marginLeft={{ base: 'md', md: '2xl' }} spot='first' />
            <PodyumSpot app={third} marginLeft={{ base: 'xxs', md: 'lg' }} spot='third' />
          </div>
        </Flex>
      </StyledContentWrapper>
    </StyledCard>
  );
};

export { AppsPodyum };
