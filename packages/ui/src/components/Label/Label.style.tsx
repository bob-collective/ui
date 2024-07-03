import styled from 'styled-components';

import { LabelPosition } from '../../theme';

type StyledLabelProps = {
  $position: LabelPosition;
};

const StyledLabel = styled.label<StyledLabelProps>`
  ${({ theme }) => theme.typography('s')}
  color: ${({ theme }) => theme.color('grey-50')};
  font-weight: ${({ theme }) => theme.fontWeight('medium')};
  align-self: flex-start;

  padding: ${({ theme, $position }) => {
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
`;

export { StyledLabel };
