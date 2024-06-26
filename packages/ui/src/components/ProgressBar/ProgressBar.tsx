import { AriaProgressBarProps, useProgressBar } from '@react-aria/progress';
import { CSSProperties } from 'react';

import { Color, ProgressBarSize } from '../../theme';
import { Flex, FlexProps } from '../Flex';
import { Span } from '../Text';

import { StyledFill, StyledTrack } from './ProgressBar.style';

type Props = { color?: Color; showValueLabel?: boolean; size?: ProgressBarSize };

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
    className,
    style,
    hidden
  } = props;

  const percentage = (value - minValue) / (maxValue - minValue);
  const barStyle: CSSProperties = { width: `${Math.round(percentage * 100)}%` };

  return (
    <Flex className={className} direction='column' gap='s' hidden={hidden} style={style} {...progressBarProps}>
      {(label || showValueLabel) && (
        <Flex gap='s'>
          {label && <Span {...labelProps}>{label}</Span>}
          {showValueLabel && <Span>{progressBarProps['aria-valuetext']}</Span>}
        </Flex>
      )}
      <StyledTrack $size={size}>
        <StyledFill $color={color} $size={size} style={barStyle} />
      </StyledTrack>
    </Flex>
  );
};

export { ProgressBar };
export type { ProgressBarProps };
