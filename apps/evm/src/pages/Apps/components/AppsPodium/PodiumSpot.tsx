import { Avatar, Flex, FlexProps, Skeleton, Spacing, Tooltip } from '@gobob/ui';

import { ResultProject } from '../../../../utils';

import { StyledAvatarWrapper, StyledMedal, StyledPodiumWrapper } from './AppsPodium.style';
import { Podium } from './Podium';

type Spot = 'first' | 'second' | 'third';

const mobileSpotMap: Record<Spot, Spacing> = {
  first: '8xl',
  second: '7xl',
  third: '6xl'
};

const smallDesktopSpotMap: Record<Spot, Spacing> = {
  first: '9xl',
  second: '8xl',
  third: '7xl'
};

const largeDesktopSpotMap: Record<Spot, Spacing> = {
  first: '10xl',
  second: '9xl',
  third: '8xl'
};

const numericSpotMap: Record<Spot, 1 | 2 | 3> = {
  first: 1,
  second: 2,
  third: 3
};

const podiumWidthMap: Record<Spot, string | undefined> = {
  first: '95%',
  second: '85%',
  third: '75%'
};

type Props = {
  app?: ResultProject;
  spot: Spot;
  isComingSoon: boolean;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type PodiumSpotProps = Props & InheritAttrs;

const PodiumSpot = ({ app, spot, isComingSoon, ...props }: PodiumSpotProps): JSX.Element => (
  <Flex alignItems='center' direction='column' flex={1} gap='lg' justifyContent='flex-end' {...props}>
    <StyledAvatarWrapper>
      <StyledMedal fontSize='md' position={numericSpotMap[spot]} size='xl' />
      {app ? (
        <Tooltip label='Oku Trade'>
          <Avatar
            borderColor='grey-300'
            rounded='md'
            size={{ base: mobileSpotMap[spot], s: smallDesktopSpotMap[spot], lg: largeDesktopSpotMap[spot] }}
            src='http://localhost:5050/src/assets/partners/okutrade.png'
          />
        </Tooltip>
      ) : isComingSoon ? (
        <Avatar
          borderColor='grey-300'
          rounded='md'
          size={{ base: mobileSpotMap[spot], s: smallDesktopSpotMap[spot], lg: largeDesktopSpotMap[spot] }}
          src=''
        />
      ) : (
        <Skeleton
          height={{ base: mobileSpotMap[spot], s: smallDesktopSpotMap[spot], lg: largeDesktopSpotMap[spot] }}
          width={{ base: mobileSpotMap[spot], s: smallDesktopSpotMap[spot], lg: largeDesktopSpotMap[spot] }}
        />
      )}
    </StyledAvatarWrapper>
    <StyledPodiumWrapper alignItems='flex-end' style={{ width: podiumWidthMap[spot] }}>
      <Podium width='100%' />
    </StyledPodiumWrapper>
  </Flex>
);

export { PodiumSpot };
