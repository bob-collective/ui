import styled, { css } from 'styled-components';

import { LabelPosition } from '../../theme';

type StyledLabelProps = {
  $position: LabelPosition;
  $error: boolean;
};

const StyledLabel = styled.label<StyledLabelProps>`
  ${({ theme, $position, $error }) => css`
    ${theme.typography('s')}
    ${theme.label.base}
    ${$error && theme.label.error}

    font-weight: ${theme.fontWeight('medium')};
    align-self: flex-start;

    padding: ${() => {
      switch ($position) {
        case 'inside':
          return `0 ${theme.spacing('xs')} 0 0`;
        case 'outside-left':
          // FIXME: padding bottom when position is on side
          return `${theme.spacing('s')} ${theme.spacing('xs')} 0.625rem 0`;
        case 'outside':
          return `${theme.spacing('xs')} 0`;
      }
    }};
  `}
`;

export { StyledLabel };
