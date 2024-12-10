import styled, { css } from 'styled-components';
import { Drawer } from 'vaul';

const StyledContent = styled(Drawer.Content)`
  ${({ theme }) => {
    return css`
      display: flex;
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      margin-top: 6rem;
      flex-direction: column;
      outline-style: none;
      height: calc(100% - 72px);

      @media ${theme.breakpoints.up('s')} {
        top: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
        left: unset;
        height: 100%;
        margin-top: 0;

        width: 310px;
        --initial-transform: calc(100% + 8px);
      }
    `;
  }}
`;

const StyledUnderlay = styled(Drawer.Overlay)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
`;

const StyledMobileContentWrapper = styled.div`
  ${({ theme }) => {
    return css`
      background: ${theme.color('grey-400')};
      border: 1px solid ${theme.color('grey-300')};
      border-top-right-radius: ${theme.rounded('xl')};
      border-top-left-radius: ${theme.rounded('xl')};
      overflow-y: auto;
      padding: 1rem;
      flex: 1 1 0%;

      @media ${theme.breakpoints.up('md')} {
        border-radius: ${theme.rounded('xl')};
      }
    `;
  }}
`;

export { StyledContent, StyledUnderlay, StyledMobileContentWrapper };
