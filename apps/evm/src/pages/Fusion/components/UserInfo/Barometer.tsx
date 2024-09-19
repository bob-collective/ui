import { CSSProperties } from 'styled-components';
import { BOBLogo } from '@gobob/icons';
import { ArrowRight, Skeleton, Span, useLocale } from '@gobob/ui';

import {
  StyledBarometer,
  StyledFill,
  StyledFillAddornment,
  StyledGift,
  StyledStep,
  StyledTrack,
  StyledValue
} from './Barometer.style';

const getPercentage = (value: number, minValue: number, maxValue: number) => {
  const result = (value - minValue) / (maxValue - minValue);

  return result > 1 ? 1 : result;
};

type BarometerProps = {
  value?: number;
  maxValue?: number;
  level?: number;
};

const minValue = 0;

const Barometer = ({ value = minValue, maxValue = minValue, level }: BarometerProps) => {
  const { locale } = useLocale();
  const percentage = getPercentage(value, minValue, maxValue);

  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };
  const addornmentStyle: CSSProperties = { left: `${Math.round(percentage * 100)}%` };

  return (
    <StyledBarometer>
      <StyledTrack>
        <StyledFill style={barStyle} />
      </StyledTrack>
      <StyledFillAddornment style={addornmentStyle}>
        <BOBLogo />
        <StyledValue
          size='xs'
          style={{
            transform: percentage > 0.98 ? `translate(-75%,-50%)` : 'translate(-50%,-50%)'
          }}
          weight='bold'
        >
          {Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
            notation: 'compact'
          }).format(value)}
        </StyledValue>
      </StyledFillAddornment>
      <StyledGift color='grey-50' size='xs' />
      <StyledStep alignItems='center' gap='xs'>
        {level ? (
          <>
            <Span size='xs'>
              {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', notation: 'compact' }).format(maxValue)}
            </Span>
            <ArrowRight size='xs' />
            <Span size='xs'>Phase {level + 1}</Span>
          </>
        ) : (
          <Skeleton width='6xl' />
        )}
      </StyledStep>
    </StyledBarometer>
  );
};

export { Barometer };
