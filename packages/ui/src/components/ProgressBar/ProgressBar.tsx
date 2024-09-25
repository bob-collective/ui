import { AriaProgressBarProps, useProgressBar } from '@react-aria/progress';
import { CSSProperties } from 'react';
import { mergeProps } from '@react-aria/utils';

import { Color, ProgressBarSize } from '../../theme';
import { Flex, FlexProps } from '../Flex';
import { Span } from '../Text';

import { StyledFill, StyledTrack, StyledWrapper } from './ProgressBar.style';

type Props = {
  color?: Color | string;
  showValueLabel?: boolean;
  size?: ProgressBarSize;
  fullWidth?: boolean;
  rounded?: boolean;
};

type AriaAttrs = Omit<AriaProgressBarProps, keyof Props>;

type InheritAttrs = Omit<FlexProps, keyof Props & AriaAttrs>;

type ProgressBarProps = Props & InheritAttrs & AriaAttrs;

const ProgressBar = (props: ProgressBarProps): JSX.Element => {
  const { progressBarProps, labelProps } = useProgressBar(props);

  const {
    value = 0,
    minValue = 0,
    maxValue = 100,
    color,
    size = 'md',
    showValueLabel,
    label,
    fullWidth,
    rounded
  } = props;

  const percentage = (value - minValue) / (maxValue - minValue);
  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };

  return (
    <StyledWrapper $fullWidth={fullWidth} direction='column' gap='s' {...mergeProps(progressBarProps, props)}>
      {(label || showValueLabel) && (
        <Flex gap='s'>
          {label && <Span {...labelProps}>{label}</Span>}
          {showValueLabel && <Span>{progressBarProps['aria-valuetext']}</Span>}
        </Flex>
      )}
      <StyledTrack $rounded={rounded} $size={size}>
        <StyledFill $color={color} $size={size} style={barStyle} />
      </StyledTrack>
    </StyledWrapper>
  );
};

export { ProgressBar };
export type { ProgressBarProps };
