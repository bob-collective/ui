import styled, { css } from 'styled-components';

import { Color, ProgressBarSize } from '../../theme';
import { Flex } from '../Flex';

type StyledTrackProps = {
  $size: ProgressBarSize;
  $rounded?: boolean;
};

type StyledFillProps = {
  $color?: Color | string;
  $size: ProgressBarSize;
};

type StyledWrapperProps = {
  $fullWidth?: boolean;
};

const StyledTrack = styled.div<StyledTrackProps>`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  min-width: ${({ theme }) => theme.spacing('2xl')};
  border-radius: ${({ $rounded, theme }) => $rounded && theme.rounded('full')};

  ${({ theme, $size }) => css`
    min-width: ${theme.spacing('2xl')};
    ${theme.progressBar.track}
    ${theme.progressBar.size[$size].track}
  `}
`;

const StyledFill = styled.div<StyledFillProps>`
  border: none;
  transition: width 100ms;
  will-change: width;

  ${({ theme, $size, $color }) => {
    return css`
      ${theme.progressBar.fill}
      ${theme.progressBar.size[$size].fill}

      background: ${$color && (theme.color($color as Color) || $color)};
    `;
  }}
`;

const StyledWrapper = styled(Flex)<StyledWrapperProps>`
  width: ${({ $fullWidth }) => $fullWidth && '100%'};
`;

export { StyledFill, StyledWrapper, StyledTrack };
