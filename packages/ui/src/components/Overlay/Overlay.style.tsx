import styled from 'styled-components';

import { overlayCSS } from '../utils/overlay';

type StyledUnderlayProps = {
  $isOpen: boolean;
  $isTransparent: boolean;
};

const StyledOverlayWrapper = styled.div`
  isolation: isolate;
  background: transparent;
`;

const StyledUnderlay = styled.div<StyledUnderlayProps>`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: ${({ $isTransparent }) => ($isTransparent ? 'transparent' : 'rgba(0, 0, 0, 0.6)')};

  ${({ $isOpen }) => overlayCSS($isOpen)}
  transition: ${({ $isOpen }) =>
    $isOpen ? 'opacity .15s cubic-bezier(0,0,.4,1)' : 'opacity .1s cubic-bezier(0.5,0,1,1), visibility 0s linear .1s'};
`;

export { StyledOverlayWrapper, StyledUnderlay };
