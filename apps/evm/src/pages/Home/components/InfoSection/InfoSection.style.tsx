import { Flex, H3 } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledContainer = styled(Flex)`
  margin: 0 auto;
  flex-direction: column;
  max-width: 36rem;

  ${({ theme }) => css`
    @media ${theme.breakpoints.up('md')} {
      max-width: ${({ theme }) => theme.maxWidth('6xl')};
    }
  `}
`;

const StyledLeftHighlight = styled(Flex)`
  border-left: 12px solid ${({ theme }) => theme.color('primary-500')};
  padding-left: ${({ theme }) => theme.spacing('lg')};
`;

const StyledSpiceFactoryImg = styled.img`
  width: 100%;

  ${({ theme }) => css`
    @media ${theme.breakpoints.up('md')} {
      max-width: 50%;
    }
  `}
`;

const StyledAboutTitle = styled(H3)`
  ${({ theme }) => css`
    ${theme.typography('4xl')}
    @media ${theme.breakpoints.up('md')} {
      ${theme.typography('5xl')}
    }
  `}
`;

export { StyledContainer, StyledLeftHighlight, StyledSpiceFactoryImg, StyledAboutTitle };
