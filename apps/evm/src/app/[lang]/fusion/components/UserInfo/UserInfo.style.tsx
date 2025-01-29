import { ArrowRight, Card, Dl, Flex, SolidDocumentDuplicate } from '@gobob/ui';
import styled from 'styled-components';

const StyledUnderlay = styled.div`
  top: -0.75rem;
  bottom: -0.75rem;
  left: -0.75rem;
  right: -0.75rem;
  position: absolute;
  z-index: 1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const StyledOverlay = styled(Flex)`
  position: absolute;
  inset: 0;
  z-index: 2;
`;

const StyledLoginCard = styled(Card)`
  max-width: ${({ theme }) => theme.maxWidth('lg')};
`;

const StyledUserInfoWrapper = styled(Flex)`
  position: relative;
  width: 100%;
`;

const StyledArrowRight = styled(ArrowRight)`
  margin-left: ${({ theme }) => theme.spacing('xs')};
`;

const StyledSolidDocumentDuplicate = styled(SolidDocumentDuplicate)`
  margin-left: ${({ theme }) => theme.spacing('xs')};
`;

const StyledDl = styled(Dl)`
  display: grid;

  @media ${({ theme }) => theme.breakpoints.up('s')} {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  @media ${({ theme }) => theme.breakpoints.up('lg')} {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
`;

const StyledMainInfo = styled(Card)`
  order: -1;

  @media ${({ theme }) => theme.breakpoints.up('s')} {
    grid-column: span 2 / span 2;
  }

  @media ${({ theme }) => theme.breakpoints.up('lg')} {
    grid-column: span 4 / span 4;
  }
`;

const StyledMeterCard = styled(Card)`
  order: -1;

  @media ${({ theme }) => theme.breakpoints.up('s')} {
    grid-column: span 2 / span 2;
  }

  @media ${({ theme }) => theme.breakpoints.up('lg')} {
    grid-column: span 2 / span 2;
    order: unset;
  }
`;

export {
  StyledArrowRight,
  StyledLoginCard,
  StyledOverlay,
  StyledSolidDocumentDuplicate,
  StyledUnderlay,
  StyledUserInfoWrapper,
  StyledDl,
  StyledMeterCard,
  StyledMainInfo
};
