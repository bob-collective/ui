import { CSSProperties } from 'styled-components';
import { Flex } from '@gobob/ui';

import { StyledFill, StyledFilledTrack, StyledTrack, StyledTrackSubtitle, StyledTrackTitle } from './Barometer.style';

const Barometer = () => {
  // const percentage = (value - minValue) / (maxValue - minValue);

  const percentage = 0.5;
  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };

  return (
    <Flex>
      <StyledFilledTrack>
        <StyledTrackTitle>S1</StyledTrackTitle>
        <StyledTrackSubtitle>Pre Launch</StyledTrackSubtitle>
      </StyledFilledTrack>
      <StyledFilledTrack />
      <StyledTrack>
        <StyledFill style={barStyle} />
      </StyledTrack>
    </Flex>
  );
};

export { Barometer };
