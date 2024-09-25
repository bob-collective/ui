import { Flex } from '@gobob/ui';
import styled from 'styled-components';

import { Main } from '../../components';

const StyledHeroSectionWrapper = styled(Flex)`
  position: relative;
  width: 100%;
`;

const StyledHeroSection = styled(Flex)`
  margin: 7.75rem auto 0 auto;
  max-width: ${({ theme }) => theme.maxWidth('7xl')};
  z-index: 1;
  width: 100%;
`;

const StyledBgDots = styled.img`
  position: absolute;
  z-index: 0;
  top: -5.5rem;
  left: 0;
  right: -0.75rem;
  bottom: 0;
`;

const StyledBackground = styled.div`
  position: absolute;
  z-index: 0;
  top: -5.5rem;
  left: 0;
  right: -0.75rem;
  bottom: 0;
  background: radial-gradient(88.64% 59.91% at 21.35% 24.65%, #1e2430 0%, #0d1017 100%);
`;

const StyledMain = styled(Main)`
  margin: -4.75rem 0 0 0;
`;

const StyledContent = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('7xl')};
  margin: 0 auto;
  width: 100%;
`;

const StyledStrategiesWrapper = styled(Flex)`
  border-top: 1px solid ${({ theme }) => theme.color('grey-300')};
  border-bottom: 1px solid ${({ theme }) => theme.color('grey-300')};
  background: linear-gradient(90deg, #12161e 0%, #08090c 100%);
`;

export {
  StyledHeroSectionWrapper,
  StyledStrategiesWrapper,
  StyledContent,
  StyledHeroSection,
  StyledMain,
  StyledBackground,
  StyledBgDots
};
