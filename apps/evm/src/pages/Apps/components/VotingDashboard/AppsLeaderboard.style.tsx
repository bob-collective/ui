import { Card, customScrollbarCSS, Flex, H3 } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledList = styled(Card)`
  border-top-left-radius: 0px;
  overflow: auto;
  ${customScrollbarCSS}

  ${({ theme }) => {
    return css`
      max-height: 18.4rem;

      @media ${theme.breakpoints.up('s')} {
        max-height: 20.938rem;
      }
    `;
  }}
`;

const StyledHeader = styled(Flex)`
  margin-bottom: -1px;
`;

const StyledH3 = styled(H3)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledHeaderWrapper = styled(Card)`
  border-right: none;
  height: 3rem;
  z-index: 1;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
`;

const StyledWrapper = styled(Flex)`
  overflow: hidden;
`;

export { StyledList, StyledWrapper, StyledHeader, StyledH3, StyledHeaderWrapper };
