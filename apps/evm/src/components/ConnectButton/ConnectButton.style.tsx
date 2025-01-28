import { DrawerClose, hexToRgba } from '@gobob/ui';
import styled from 'styled-components';

type StyledCloseButtonProps = {
  $isOpen?: boolean;
};

const StyledCloseButton = styled(DrawerClose)<StyledCloseButtonProps>`
  background-color: transparent;
  border: 0;
  border-top-left-radius: ${({ theme }) => theme.rounded('lg')};
  border-bottom-left-radius: ${({ theme }) => theme.rounded('lg')};
  cursor: pointer;
  width: 4rem;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  display: flex;
  padding-top: ${({ theme }) => theme.spacing('3xl')};
  padding-left: ${({ theme }) => theme.spacing('lg')};

  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(-95%)' : 'translateX(0%)')};
  ${({ theme }) => theme.transition('common', 'normal')}

  &:hover, &:focus-visible {
    background-color: ${({ theme }) => hexToRgba(theme.color('grey-300'), 40)};
    transform: ${({ $isOpen }) => $isOpen && 'translateX(-75%)'};
  }
`;

export { StyledCloseButton };
