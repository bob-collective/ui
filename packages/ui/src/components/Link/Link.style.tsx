import styled, { css } from 'styled-components';

import { ArrowTopRightOnSquare } from '../../icons';
import { Text } from '../Text/style';

type LinkProps = {
  $underlined?: 'none' | 'hover' | 'always';
  $isFocusVisible?: boolean;
};

const StyledLink = styled(Text)<LinkProps>`
  ${({ theme }) => theme.link.base};
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};

  &[aria-disabled] {
    ${({ theme }) => theme.link.disabled};
  }

  &:hover:not([aria-disabled='true']) {
    ${({ theme }) => theme.link.hover};
  }

  ${({ $underlined }) => {
    switch ($underlined) {
      case 'none':
      default:
        return css`
          text-decoration: none;
        `;
      case 'always':
        return css`
          text-decoration: underline;
        `;
      case 'hover':
        return css`
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        `;
    }
  }}
`;

const StyledIcon = styled(ArrowTopRightOnSquare)`
  ${({ theme }) => theme.link.icon};
`;

export { StyledIcon, StyledLink };
