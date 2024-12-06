import { ArrowLongRight } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledArrowLongRight = styled(ArrowLongRight)`
  ${({ theme }) => {
    return css`
      @media ${theme.breakpoints.down('s')} {
        transform: rotate(90deg);
      }
    `;
  }}
`;

export { StyledArrowLongRight };
