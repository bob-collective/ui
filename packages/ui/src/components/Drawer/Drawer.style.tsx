import styled from 'styled-components';
import { Drawer } from 'vaul';

import { buttonCSS, StyledButtonProps, unstyledButtonCSS, UnstyledButtonProps } from '../utils';

const StyledOverlay = styled(Drawer.Overlay)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const StyledTrigger = styled(Drawer.Trigger)<UnstyledButtonProps>`
  ${(props) => unstyledButtonCSS(props)}
`;

const StyledButton = styled(Drawer.Trigger)<StyledButtonProps>`
  ${(props) => unstyledButtonCSS(props)}
  ${(props) => buttonCSS(props)}
`;

const StyledInnerContent = styled.div`
  background: ${({ theme }) => theme.color('grey-400')};
  border: 1px solid ${({ theme }) => theme.color('grey-300')};

  overflow-y: auto;
  padding: 1rem;
  flex: 1 1 0%;
`;

const StyledContent = styled(Drawer.Content)`
  display: flex;
  position: fixed;
  flex-direction: column;
  outline-style: none;

  &[data-vaul-drawer-direction='bottom'] {
    right: 0;
    bottom: 0;
    left: 0;
    margin-top: 6rem;

    height: calc(100% - 72px);

    ${StyledInnerContent} {
      border-top-right-radius: ${({ theme }) => theme.rounded('xl')};
      border-top-left-radius: ${({ theme }) => theme.rounded('xl')};
    }
  }

  &[data-vaul-drawer-direction='right'] {
    top: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    height: 100%;
    margin-top: 0;
    width: 310px;
    --initial-transform: calc(100% + 8px);

    ${StyledInnerContent} {
      border-radius: ${({ theme }) => theme.rounded('xl')};
    }
  }
`;

export { StyledOverlay, StyledButton, StyledContent, StyledInnerContent, StyledTrigger };
