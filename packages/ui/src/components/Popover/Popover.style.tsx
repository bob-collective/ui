import styled from 'styled-components';

import { Placement } from '../../theme';
import { getOverlayPlacementCSS, overlayCSS } from '../utils/overlay';

type StyledPopoverProps = {
  $placement?: Placement | 'center';
  $isOpen: boolean;
};

const StyledPopover = styled.div<StyledPopoverProps>`
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;

  min-width: ${({ theme }) => theme.spacing('4xl')};
  min-height: ${({ theme }) => theme.spacing('4xl')};
  max-width: calc(100% - ${({ theme }) => theme.spacing('4xl')});

  position: absolute;

  outline: none; /* Hide focus outline */
  box-sizing: border-box;

  ${({ $isOpen }) => overlayCSS(!!$isOpen)}
  ${({ $placement }) => $placement && getOverlayPlacementCSS($placement as any)}

  transition: transform 100ms ease-in-out, opacity 100ms ease-in-out, visibility 0s linear 100ms;
`;

export { StyledPopover };
