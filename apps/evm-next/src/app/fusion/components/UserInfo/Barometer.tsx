import { CSSProperties } from 'styled-components';
import { BOBLogo } from '@gobob/icons';
import { Skeleton, Span, useLocale } from '@gobob/ui';

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
  showGoal?: boolean;
};

const minValue = 0;

const Barometer = ({ value = minValue, maxValue = 100, showGoal }: BarometerProps) => {
  const { locale } = useLocale();
  const percentage = getPercentage(value, minValue, maxValue);
  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };
  const addornmentStyle: CSSProperties = {
    left: `${Math.round(percentage * 100)}%`
  };

  const isTouchingStart = percentage < 0.09;
  const isTouchingEnd = percentage > 0.9;

  const isTouchingEnds = isTouchingStart || isTouchingEnd;

  return (
    <StyledBarometer>
      <StyledTrack>
        <StyledFill style={barStyle} />
      </StyledTrack>
      <StyledFillAddornment style={addornmentStyle}>
        <BOBLogo />
        <StyledValue
          noWrap
          size='xs'
          style={{
            left: isTouchingStart ? 0 : isTouchingEnds ? undefined : '50%',
            right: isTouchingEnd ? 0 : undefined,
            transform: `translate(${isTouchingEnds ? '0%' : '-50%'},-50%)`
          }}
          weight='bold'
        >
          {Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
            notation: 'compact'
          }).format(value)}{' '}
          TVL
        </StyledValue>
      </StyledFillAddornment>
      {percentage < 0.98 && <StyledGift color='grey-50' size='xxs' />}
      {showGoal && (
        <StyledStep alignItems='center' gap='xs'>
          {maxValue ? (
            <>
              <Span size='xs' weight='bold'>
                {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', notation: 'compact' }).format(
                  maxValue
                )}
              </Span>
            </>
          ) : (
            <Skeleton width='6xl' />
          )}
        </StyledStep>
      )}
    </StyledBarometer>
  );
};

export { Barometer };
