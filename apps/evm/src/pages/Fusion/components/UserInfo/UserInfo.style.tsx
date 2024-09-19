import { ArrowRight, Card, Flex, SolidDocumentDuplicate } from '@gobob/ui';
import styled from 'styled-components';

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

const StyledUserInfoWrapper = styled(Flex)`
  position: relative;
  max-width: ${({ theme }) => theme.maxWidth('4xl')};
  margin: 0 auto;
`;

const StyledArrowRight = styled(ArrowRight)`
  margin-left: ${({ theme }) => theme.spacing('xs')};
`;

const StyledSolidDocumentDuplicate = styled(SolidDocumentDuplicate)`
  margin-left: ${({ theme }) => theme.spacing('xs')};
`;

const StyledHarvestArrow = styled(ArrowRight)`
  transform: rotate(90deg);

  align-self: center;

  @media ${({ theme }) => theme.breakpoints.up('md')} {
    transform: unset;
  }
`;

export {
  StyledAmountWrapper,
  StyledArrowRight,
  StyledHarvestArrow,
  StyledLoginCard,
  StyledOverlay,
  StyledSolidDocumentDuplicate,
  StyledUnderlay,
  StyledUserInfoWrapper
};
