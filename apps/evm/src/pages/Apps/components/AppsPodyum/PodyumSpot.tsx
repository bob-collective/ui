import { Avatar, Flex, FlexProps, P, Skeleton, Spacing } from '@gobob/ui';

import { ResultVotingAppData } from '../../hooks/useGetPodyumData';

import { StyledAvatarWrapper, StyledMedal } from './AppsPodyum.style';

type Spot = 'first' | 'second' | 'third';

const mobileSpotMap: Record<Spot, Spacing> = {
  first: '8xl',
  second: '7xl',
  third: '6xl'
};

const desktopSpotMap: Record<Spot, Spacing> = {
  first: '10xl',
  second: '8xl',
  third: '7xl'
};

const numericSpotMap: Record<Spot, 1 | 2 | 3> = {
  first: 1,
  second: 2,
  third: 3
};

type Props = {
  app?: ResultVotingAppData;
  spot: Spot;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type PodyumSpotProps = Props & InheritAttrs;

const PodyumSpot = ({ app, spot, ...props }: PodyumSpotProps): JSX.Element => {
  return (
    <Flex alignItems='center' direction='column' gap={{ base: 's', md: 'lg' }} {...props}>
      <StyledAvatarWrapper>
        <StyledMedal
          fontSize={{ base: 's', md: 'md' }}
          position={numericSpotMap[spot]}
          size={{ base: 'lg', md: 'xl' }}
        />
        {app ? (
          <Avatar
            borderColor='grey-300'
            rounded='md'
            size={{ base: mobileSpotMap[spot], md: desktopSpotMap[spot] }}
            src={app.logoSrc}
          />
        ) : (
          <Skeleton
            height={{ base: mobileSpotMap[spot], md: desktopSpotMap[spot] }}
            width={{ base: mobileSpotMap[spot], md: desktopSpotMap[spot] }}
          />
        )}
      </StyledAvatarWrapper>
      {app ? (
        <P align='center' size={{ base: 's', md: 'md' }}>
          {app.name}
        </P>
      ) : (
        <Skeleton width='5xl' />
      )}
    </Flex>
  );
};

export { PodyumSpot };
