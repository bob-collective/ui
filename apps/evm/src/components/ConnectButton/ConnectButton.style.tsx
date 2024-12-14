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

      @media ${theme.breakpoints.up('s')} {
        top: 0.5rem;
        right: 0.5rem;
        bottom: 0.5rem;
        left: unset;
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
      border-radius: ${theme.rounded('xl')};
      overflow-y: auto;
      padding: 1rem;
      flex: 1 1 0%;

      @media ${theme.breakpoints.up('md')} {
        border-radius: ${theme.rounded('xl')};
      }
    `;
  }}
`;

const StyledTrigger = styled(Drawer.Trigger)`
  background-color: transparent;
  cursor: pointer;
  border: 0;
  padding: 0;
  appearance: none;
  text-align: left;
  text-decoration: none;
  color: inherit;
  touch-action: manipulation;
  align-items: center;
  justify-content: center;
  border: 0px solid;
  white-space: nowrap;

  user-select: none;

  ${({ theme }) => {
    const { hover } = theme.button.variant.ghost.color.default;

    return css`
      ${theme.button.base}
      ${theme.button.size.s}
      ${theme.button.variant.ghost.color.default.base}
      &:hover:not([disabled]) {
        ${hover}
      }

      &:active:not([disabled]) {
        ${theme.button.active}
      }

      &[aria-disabled='true'],
      &[disabled] {
        pointer-events: none;
        cursor: not-allowed;
        ${theme.button.disabled}
      }
    `;
  }}
`;

const MobilePill = styled.div`
  opacity: 1;
  background-color: rgb(212 212 216);
  border-radius: 9999px;
  flex-shrink: 0;
  width: 3rem;
  height: 0.375rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
`;

export { StyledContent, StyledTrigger, StyledUnderlay, StyledMobileContentWrapper, MobilePill };
