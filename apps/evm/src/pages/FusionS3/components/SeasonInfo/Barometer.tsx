import { CSSProperties, useTheme } from 'styled-components';
import { useLocale, useMediaQuery } from '@gobob/ui';

import {
  StyledBarometer,
  StyledFill,
  StyledFilledTrackWrapper,
  StyledFirstTrack,
  StyledSecondTrack,
  StyledStep,
  StyledStepBar,
  StyledTrack,
  StyledTrackSubtitle,
  StyledTrackTitle
} from './Barometer.style';

const getPercentage = (value: number, minValue: number, maxValue: number) => (value - minValue) / (maxValue - minValue);

const Step = ({
  currentValue,
  maxValue,
  minValue,
  value,
  showBar: showBarProp,
  showValue: showValueProp
}: {
  currentValue: number;
  minValue: number;
  maxValue: number;
  value: number;
  showBar?: boolean;
  showValue?: boolean;
}) => {
  const { locale } = useLocale();
  const theme = useTheme();
  const isTable = useMediaQuery(theme.breakpoints.down('md'));

  const percentage = getPercentage(value, minValue, maxValue) * 100;

  const showBar =
    showBarProp !== undefined ? showBarProp : isTable ? currentValue < value && value - currentValue < 100 : true;
  const showValue =
    showValueProp !== undefined ? showValueProp : isTable ? currentValue < value && value - currentValue < 100 : true;

  return (
    <>
      {showBar && <StyledStepBar style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }} />}
      {showValue && (
        <StyledStep
          key={value}
          color='grey-50'
          size='xs'
          style={value < maxValue ? { left: `${percentage}%`, transform: 'translateX(-50%)' } : { right: 0 }}
        >
          {Intl.NumberFormat(locale, { notation: 'compact', currency: 'USD' }).format(value * 1000000)}
        </StyledStep>
      )}
    </>
  );
};

const Barometer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const isTable = useMediaQuery(theme.breakpoints.down('md'));

  const value = 39;

  const minValue = 35;
  const maxValue = 300;

  const percentage = getPercentage(value, minValue, maxValue);

  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };

  return (
    <StyledBarometer>
      <StyledFilledTrackWrapper>
        <StyledTrackTitle size='xs'>S1</StyledTrackTitle>
        <StyledTrackSubtitle noWrap color='grey-50' size='xs'>
          Pre Launch
        </StyledTrackSubtitle>
        <StyledFirstTrack />
      </StyledFilledTrackWrapper>
      <StyledFilledTrackWrapper>
        <StyledTrackTitle size='xs'>S2</StyledTrackTitle>
        <StyledTrackSubtitle color='grey-50' size='xs'>
          Bootstrapping
        </StyledTrackSubtitle>
        <StyledSecondTrack />
      </StyledFilledTrackWrapper>
      <StyledFilledTrackWrapper>
        <StyledTrackTitle size='xs'>Season 3</StyledTrackTitle>
        <Step showValue currentValue={value} maxValue={maxValue} minValue={minValue} value={35} />
        {!isTable && <Step currentValue={value} maxValue={maxValue} minValue={minValue} value={50} />}
        <Step currentValue={value} maxValue={maxValue} minValue={minValue} value={100} />
        <Step currentValue={value} maxValue={maxValue} minValue={minValue} value={150} />
        <Step currentValue={value} maxValue={maxValue} minValue={minValue} value={200} />
        {!isMobile && <Step currentValue={value} maxValue={maxValue} minValue={minValue} value={250} />}
        <Step showValue currentValue={value} maxValue={maxValue} minValue={minValue} showBar={false} value={300} />
        <StyledTrack>
          <StyledFill style={barStyle} />
        </StyledTrack>
      </StyledFilledTrackWrapper>
    </StyledBarometer>
  );
};

export { Barometer };
