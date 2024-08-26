import { GoldMedal } from './GoldMedal';
import { SilverMedal } from './SilverMedal';
import { BronzeMedal } from './BronzeMedal';
import { CommonMedal } from './CommonMedal';
import { StyledMedalContent, StyledWrapper } from './ProjectMedal.style';

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

type Props = { position: number };

type ProjectMedalProps = Props;

const ProjectMedal = ({ position }: ProjectMedalProps): JSX.Element => {
  const Medal = getMedal(position);

  const isCommonMedal = Medal === CommonMedal;

  return (
    <StyledWrapper>
      <Medal />
      <StyledMedalContent color={isCommonMedal ? 'light' : 'dark'} weight='bold'>
        {position}
      </StyledMedalContent>
    </StyledWrapper>
  );
};

export { ProjectMedal };
