import { Avatar, CardProps, Flex, H3, Skeleton, Spacing, Tooltip } from '@gobob/ui';

import { ResultVotingAppData } from '../../hooks';
import { Trapezoid } from '../../../../components';

import {
  StyledAvatarWrapper,
  StyledConfetti,
  StyledMedal,
  StyledPodiumCard,
  StyledPodiumCardInner,
  StyledPodiums
} from './AppsPodium.style';

type Spot = 'first' | 'second' | 'third';

const cardsColors = {
  red: {
    background: 'rgba(255, 114, 114, 0.5)',
    trapezoid: '#ff7272',
    border: '#ff7272e5'
  },
  purple: {
    background: 'rgba(176, 114, 255, 0.5)',
    trapezoid: '#B072FF',
    border: '#B072FFE5'
  },
  pink: {
    background: 'rgba(255, 114, 207, 0.5)',
    trapezoid: '#FF72CF',
    border: '#FF72CF80'
  }
};

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

const PodiumSpot = ({ app, spot }: { app: any; spot: Spot }) => (
  <Flex alignItems='center' direction='column' justifyContent='flex-end'>
    <StyledAvatarWrapper>
      <StyledMedal fontSize={{ base: 's', md: 'md' }} position={numericSpotMap[spot]} size={{ base: 'lg', md: 'xl' }} />
      {app ? (
        <Tooltip label='Oku Trade'>
          <Avatar
            borderColor='grey-300'
            rounded='md'
            size={{ base: mobileSpotMap[spot], md: desktopSpotMap[spot] }}
            src='http://localhost:5050/src/assets/partners/okutrade.png'
          />
        </Tooltip>
      ) : (
        <Skeleton
          height={{ base: mobileSpotMap[spot], md: desktopSpotMap[spot] }}
          width={{ base: mobileSpotMap[spot], md: desktopSpotMap[spot] }}
        />
      )}
    </StyledAvatarWrapper>
    <StyledPodiums />
  </Flex>
);

const CategoryPodium = ({ category, color: colorProp }: { category: string; color: 'red' | 'purple' | 'pink' }) => {
  const color = cardsColors[colorProp];

  return (
    <StyledPodiumCard $color={color} flex={1} padding='none'>
      <StyledPodiumCardInner $color={color} direction='column' gap='6xl'>
        <Trapezoid
          borderColor={color.trapezoid}
          direction='inverted'
          rounded={{ bottomLeft: 's', bottomRight: 's' }}
          size='lg'
          style={{ alignSelf: 'center' }}
        >
          {category}
        </Trapezoid>
        <StyledConfetti />
        <Flex>
          <PodiumSpot app={true} spot='second' />
          <PodiumSpot app={true} spot='first' />
          <PodiumSpot app={true} spot='third' />
        </Flex>
      </StyledPodiumCardInner>
    </StyledPodiumCard>
  );
};

type Props = {
  apps: [ResultVotingAppData, ResultVotingAppData, ResultVotingAppData];
  isLoading?: boolean;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppPodiumProps = Props & InheritAttrs;

const AppsPodium = ({ apps, isLoading }: AppPodiumProps): JSX.Element => {
  const [first, second, third] = !isLoading ? apps : [undefined, undefined, undefined];

  return (
    <Flex direction='column' gap='3xl' marginTop='4xl'>
      <H3 size='3xl'>Last Week&apos;s Winners</H3>
      <Flex direction={{ base: 'column', md: 'row' }} gap='md'>
        <CategoryPodium category='DeFi' color='red' />
        <CategoryPodium category="Gaming and NFT's" color='purple' />
        <CategoryPodium category='Newcomers' color='pink' />
      </Flex>
    </Flex>
  );
};

export { AppsPodium };
