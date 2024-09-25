import { Button } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledLearnButton = styled(Button)`
  ${({ theme }) => {
    return css`
      width: 100%;

      @media ${theme.breakpoints.up('s')} {
        width: 45%;
      }
    `;
  }}
`;

export { StyledLearnButton };
