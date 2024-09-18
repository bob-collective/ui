import { CSSProperties, useTheme } from 'styled-components';
import { useMediaQuery } from '@gobob/ui';
import { Spice } from '@gobob/icons';

import { StyledBarometer, StyledFill, StyledFillAddornment, StyledTrack } from './Barometer.style';

const getPercentage = (value: number, minValue: number, maxValue: number) => (value - minValue) / (maxValue - minValue);

type BarometerProps = {
  value?: number;
};

const minValue = 0;
const maxValue = 300000000;

const Barometer = ({ value = minValue }: BarometerProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const isTable = useMediaQuery(theme.breakpoints.down('md'));

  const percentage = getPercentage(value, minValue, maxValue);

  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };
  const addornmentStyle: CSSProperties = { left: `${Math.round(percentage * 100)}%` };

  return (
    <StyledBarometer>
      <StyledTrack>
        <StyledFill style={barStyle} />
      </StyledTrack>
      <StyledFillAddornment style={addornmentStyle}>
        <Spice />
      </StyledFillAddornment>
    </StyledBarometer>
  );
};

export { Barometer };
