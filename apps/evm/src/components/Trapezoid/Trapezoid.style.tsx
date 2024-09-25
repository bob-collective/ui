import { Color, Rounded, Span } from '@gobob/ui';
import styled, { css } from 'styled-components';

type StyledSpanProps = {
  $rounded?: Rounded | { topLeft?: Rounded; topRight?: Rounded; bottomLeft?: Rounded; bottomRight?: Rounded };
  $direction?: 'normal' | 'inverted';
  $background: Color;
};

const StyledSpan = styled(Span)<StyledSpanProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: 100%;
  background: ${({ $background, theme }) => theme.color($background)};

  &:before {
    content: ' ';
    display: block;
    background: ${({ $background, theme }) => theme.color($background)};
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -10px;
    z-index: -1;

    ${({ theme, $rounded, $direction }) => {
      const roundedTopLeft = typeof $rounded === 'object' ? $rounded.topLeft : $rounded;
      const roundedBottomLeft = typeof $rounded === 'object' ? $rounded.bottomLeft : $rounded;

      return css`
        transform: skew(${$direction === 'normal' ? '-10deg' : '10deg'});
        border-top-left-radius: ${roundedTopLeft && theme.rounded(roundedTopLeft)};
        border-bottom-left-radius: ${roundedBottomLeft && theme.rounded(roundedBottomLeft)};
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
    top: 0;
    right: -10px;
    z-index: -1;

    ${({ theme, $rounded, $direction }) => {
      const roundedTopRight = typeof $rounded === 'object' ? $rounded.topRight : $rounded;
      const roundedBottomRight = typeof $rounded === 'object' ? $rounded.bottomRight : $rounded;

      return css`
        transform: skew(${$direction === 'normal' ? '10deg' : '-10deg'});
        border-top-right-radius: ${roundedTopRight && theme.rounded(roundedTopRight)};
        border-bottom-right-radius: ${roundedBottomRight && theme.rounded(roundedBottomRight)};
      `;
    }}
  }
`;

export { StyledSpan };
