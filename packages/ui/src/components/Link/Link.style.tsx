import styled, { css } from 'styled-components';

import { ArrowTopRightOnSquare } from '../../icons';
import { Text } from '../Text/style';

type LinkProps = {
  $underlined?: 'none' | 'hover' | 'always';
};

const StyledLink = styled(Text)<LinkProps>`
  display: inline-flex;
  align-items: center;
  ${({ theme }) => theme.link.base};
  cursor: pointer;

  &[aria-disabled] {
    cursor: default;
    opacity: 0.5;
  }

  &:hover:not([aria-disabled='true']) {
    opacity: 0.75;
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
