import { Flex, Span } from '@gobob/ui';
import styled from 'styled-components';

const StyledWrapper = styled(Flex)`
  position: relative;
`;

const StyledMedalContent = styled(Span)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
`;

export { StyledWrapper, StyledMedalContent };
