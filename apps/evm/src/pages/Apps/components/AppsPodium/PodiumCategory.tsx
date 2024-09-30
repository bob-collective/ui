import { CardProps, Skeleton } from '@gobob/ui';

import { Trapezoid } from '../../../../components';
import { ResultProjectCategory } from '../../../../utils';

import { StyledConfetti, StyledPodiumCard, StyledPodiumCardInner, StyledPodiums } from './AppsPodium.style';
import { PodiumSpot } from './PodiumSpot';

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

type Props = { isComingSoon: boolean; category?: ResultProjectCategory; color: 'red' | 'purple' | 'pink' };

type InheritAttrs = Omit<CardProps, keyof Props>;

type PodiumSpotProps = Props & InheritAttrs;

const PodiumCategory = ({ category, isComingSoon, color: colorProp, ...props }: PodiumSpotProps): JSX.Element => {
  const color = cardsColors[colorProp];

  const [first, second, third] = (category?.projects || []).sort((a, b) => b.rank - a.rank);

  return (
    <StyledPodiumCard $color={color} flex={1} padding='none' {...props}>
      <StyledPodiumCardInner $color={color} alignItems='center' direction='column' gap='6xl'>
        <Trapezoid
          borderColor={color.trapezoid}
          direction='inverted'
          rounded={{ bottomLeft: 's', bottomRight: 's' }}
          size='lg'
        >
          {isComingSoon ? 'Category' : category?.name || <Skeleton width='9xl' />}
        </Trapezoid>
        <StyledConfetti />
        <StyledPodiums gap='lg' marginX='lg'>
          <PodiumSpot app={first} isComingSoon={isComingSoon} spot='second' />
          <PodiumSpot app={second} isComingSoon={isComingSoon} spot='first' />
          <PodiumSpot app={third} isComingSoon={isComingSoon} spot='third' />
        </StyledPodiums>
      </StyledPodiumCardInner>
    </StyledPodiumCard>
  );
};

export { PodiumCategory };
