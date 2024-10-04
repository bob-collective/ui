import { HTMLAttributes } from 'react';
import { IconProps, TextProps } from '@gobob/ui';

import { GoldMedal } from './GoldMedal';
import { SilverMedal } from './SilverMedal';
import { BronzeMedal } from './BronzeMedal';
import { CommonMedal } from './CommonMedal';
import { StyledMedalContent, StyledMedalWrapper, StyledWrapper } from './Medal.style';

const getMedal = (position: number) => {
  switch (position) {
    case 1:
      return GoldMedal;
    case 2:
      return SilverMedal;
    case 3:
      return BronzeMedal;
    default:
      return CommonMedal;
  }
};

type Props = { position: number; size?: IconProps['size']; fontSize?: TextProps['size'] };

type InhritAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type MedalProps = Props & InhritAttrs;

const Medal = ({ position, size = 'xl', fontSize, ...props }: MedalProps): JSX.Element => {
  const Component = getMedal(position);

  const isCommonMedal = position > 3;

  return (
    <StyledWrapper {...props}>
      <StyledMedalWrapper>
        <Component size={size} style={{ width: 'auto' }} />
        <StyledMedalContent color={isCommonMedal ? 'light' : 'dark'} size={fontSize} weight='bold'>
          {position}
        </StyledMedalContent>
      </StyledMedalWrapper>
    </StyledWrapper>
  );
};

export { Medal };
