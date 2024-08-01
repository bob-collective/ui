import styled, { css } from 'styled-components';

import { ChipSize, Color, Rounded } from '../../theme';
import { Span } from '../Text';

type StyledChipProps = {
  $size: ChipSize;
  $background?: Color;
  $rounded?: Rounded;
  $borderColor?: Color;
};

const StyledChip = styled.div<StyledChipProps>`
  display: inline-flex;
  position: relative;
  box-sizing: border-box;
  min-width: -moz-min-content;
  min-width: min-content;
  max-width: -moz-fit-content;
  max-width: fit-content;
  white-space: nowrap;
  justify-content: space-between;
  align-items: center;

  ${({ theme, $size, $rounded, $background, $borderColor }) => css`
    border-radius: ${$rounded && theme.rounded($rounded)};
    background-color: ${$background && theme.color($background)};
    border: ${$borderColor && `1px solid ${theme.color($borderColor)}`};

    ${theme.chip.base}
    ${theme.chip.size[$size].base}
  `}
`;

const StyledContent = styled(Span)<Pick<StyledChipProps, '$size'>>`
  flex: 1 1 0%;
  ${({ theme, $size }) => theme.chip.size[$size].content}
`;

export { StyledChip, StyledContent };
