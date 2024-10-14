import { Span } from '@gobob/ui';
import styled from 'styled-components';

const StyledMedalWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StyledMedalContent = styled(Span)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
`;

const StyledWrapper = styled.div`
  display: inline-flex;
`;

export { StyledMedalWrapper, StyledMedalContent, StyledWrapper };
