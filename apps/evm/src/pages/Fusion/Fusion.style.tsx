import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledWrapper = styled(Flex)`
  position: relative;
`;

const StyledBgDots = styled.img`
  position: absolute;
  z-index: 0;
  top: -5.5rem;
  left: -0.75rem;
  right: -0.75rem;
  bottom: 0;
`;

const StyledBackground = styled.div`
  position: absolute;
  z-index: 0;
  top: -5.5rem;
  background: radial-gradient(88.64% 59.91% at 21.35% 24.65%, #1e2430 0%, #0d1017 100%);
`;

export { StyledWrapper, StyledBackground, StyledBgDots };
