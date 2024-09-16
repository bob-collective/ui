import { ArrowRight, Card, Dl, Flex, SolidDocumentDuplicate } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledDl = styled(Dl)`
  ${({ theme }) => {
    return css`
      display: grid;
      grid-auto-rows: auto;

      grid-template-columns: repeat(1, 1fr);

      @media ${theme.breakpoints.up('s')} {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
      }

      @media ${theme.breakpoints.up('md')} {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
      }

      @media ${theme.breakpoints.up('lg')} {
        display: flex;
      }
    `;
  }}
`;

const StyledCard = styled(Card)`
  ${({ theme }) => {
    return css`
      @media ${theme.breakpoints.up('s')} {
        &:last-of-type {
          grid-column: span 2 / span 2;
        }
      }
    `;
  }}
`;

const StyledUnderlay = styled.div`
  top: -0.75rem;
  bottom: -0.75rem;
  left: -0.75rem;
  right: -0.75rem;
  position: absolute;
  z-index: 1;
  backdrop-filter: blur(4px);
`;

const StyledOverlay = styled(Flex)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;

const StyledLoginCard = styled(Card)`
  max-width: ${({ theme }) => theme.maxWidth('lg')};
`;

const StyledAmountWrapper = styled(Flex)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledUserInfoWrapper = styled.div`
  position: relative;
`;

const StyledArrowRight = styled(ArrowRight)`
  margin-left: ${({ theme }) => theme.spacing('xs')};
`;

const StyledSolidDocumentDuplicate = styled(SolidDocumentDuplicate)`
  margin-left: ${({ theme }) => theme.spacing('xs')};
`;

export {
  StyledDl,
  StyledArrowRight,
  StyledUserInfoWrapper,
  StyledAmountWrapper,
  StyledLoginCard,
  StyledOverlay,
  StyledUnderlay,
  StyledSolidDocumentDuplicate,
  StyledCard
};
