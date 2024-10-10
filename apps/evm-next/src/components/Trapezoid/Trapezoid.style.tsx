import { Color, Rounded, Span } from '@gobob/ui';
import styled, { css } from 'styled-components';

type StyledSpanProps = {
  $rounded?: Rounded | { topLeft?: Rounded; topRight?: Rounded; bottomLeft?: Rounded; bottomRight?: Rounded };
  $direction?: 'normal' | 'inverted';
  $background: Color;
  $borderColor?: Color | string;
};

const StyledSpan = styled(Span)<StyledSpanProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: 100%;
  background: ${({ $background, theme }) => theme.color($background)};
  ${({ theme, $borderColor }) =>
    $borderColor &&
    css`
      padding-left: ${theme.spacing('s')};
      padding-right: ${theme.spacing('s')};
      border-top: 1px solid ${theme.color($borderColor as Color)};
      border-bottom: 1px solid ${theme.color($borderColor as Color)};
    `}

  &:before {
    content: ' ';
    display: block;
    background: ${({ $background, theme }) => theme.color($background)};
    width: 20px;
    height: 100%;
    position: absolute;
    left: -10px;
    z-index: -1;
    box-sizing: content-box;

    ${({ theme, $rounded, $direction, $borderColor }) => {
      const roundedTopLeft = typeof $rounded === 'object' ? $rounded.topLeft : $rounded;
      const roundedBottomLeft = typeof $rounded === 'object' ? $rounded.bottomLeft : $rounded;

      return css`
        transform: skew(${$direction === 'normal' ? '-10deg' : '10deg'});
        border-top-left-radius: ${roundedTopLeft && theme.rounded(roundedTopLeft)};
        border-bottom-left-radius: ${roundedBottomLeft && theme.rounded(roundedBottomLeft)};

        border: ${$borderColor && `1px solid ${theme.color($borderColor as Color)}`};
      `;
    }}
  }

  &:after {
    content: ' ';
    display: block;
    background: ${({ $background, theme }) => theme.color($background)};
    width: 20px;
    height: 100%;
    position: absolute;
    right: -10px;
    z-index: -1;
    box-sizing: content-box;

    ${({ theme, $rounded, $direction, $borderColor }) => {
      const roundedTopRight = typeof $rounded === 'object' ? $rounded.topRight : $rounded;
      const roundedBottomRight = typeof $rounded === 'object' ? $rounded.bottomRight : $rounded;

      return css`
        transform: skew(${$direction === 'normal' ? '10deg' : '-10deg'});
        border-top-right-radius: ${roundedTopRight && theme.rounded(roundedTopRight)};
        border-bottom-right-radius: ${roundedBottomRight && theme.rounded(roundedBottomRight)};

        border: ${$borderColor && `1px solid ${theme.color($borderColor as Color)}`};
      `;
    }}
  }
`;

const StyledWrapper = styled.div`
  z-index: 1;
  padding-left: 20;
  padding-right: 20;
`;

export { StyledSpan, StyledWrapper };
