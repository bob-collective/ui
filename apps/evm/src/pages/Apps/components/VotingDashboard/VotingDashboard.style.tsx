import { Link } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledViewRules = styled(Link)`
  ${({ theme }) => {
    return css`
      align-self: flex-end;

      @media ${theme.breakpoints.up('s')} {
        align-self: normal;
      }
    `;
  }}
`;

export { StyledViewRules };
