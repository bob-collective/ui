import { MaxWidth, ResponsiveProp, Spacing, Span } from '@gobob/ui';
import { Drawer, Flex } from '@gobob/ui';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

type StyledMainProps = {
  $maxWidth?: ResponsiveProp<MaxWidth>;
  $padding: Spacing;
};

const StyledLayout = styled(Flex)`
  min-height: 100vh;
  // TODO: figure this out
  background-color: #0d1017;
`;

const StyledHeader = styled(Flex)`
  width: 100%;
  padding-right: ${({ theme }) => theme.spacing('3xl')};
  overflow-x: hidden;
  z-index: 20;
  max-width: ${({ theme }) => theme.maxWidth('7xl')};
  margin: 0 auto;
`;

const StyledLogoWrapper = styled(Flex)`
  height: 76px;
  padding-left: ${({ theme }) => theme.spacing('3xl')};
`;

const StyledDrawer = styled(Drawer)`
  height: 100%;
`;

const StyledMain = styled.main<StyledMainProps>`
  width: 100%;
  overflow-x: hidden;
  padding: ${({ theme, $padding }) => theme.spacing($padding)};
  margin-left: auto;
  margin-right: auto;

  ${({ $maxWidth, theme }) =>
    typeof $maxWidth === 'object'
      ? css`
          ${$maxWidth.base && theme.breakpoints.media.base`max-width: ${theme.maxWidth($maxWidth.base)};`}
          ${$maxWidth.s && theme.breakpoints.media.s`max-width: ${theme.maxWidth($maxWidth.s)};`}
    ${$maxWidth.md && theme.breakpoints.media.md`max-width: ${theme.maxWidth($maxWidth.md)};`}
    ${$maxWidth.lg && theme.breakpoints.media.lg`max-width: ${theme.maxWidth($maxWidth.lg)};`}
    ${$maxWidth.xl && theme.breakpoints.media.xl`max-width: ${theme.maxWidth($maxWidth.xl)};`}
        `
      : $maxWidth && `max-width:${theme.maxWidth($maxWidth)};`}
  min-height: calc(100vh - 4.75rem);
`;

// TODO: to be removed
const StyledBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: calc(100vh - 0px);
  user-select: none;
  pointer-events: none;
  width: 100%;
  max-height: 70rem;
  object-fit: cover;
`;

// TODO: to be removed
const StyledContent = styled.div`
  position: relative;
`;

type StyledNavLinkProps = {
  $isActive?: boolean;
};

const StyledNativeNavLink = styled(NavLink)<StyledNavLinkProps>`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledNavLink = styled(Span)<StyledNavLinkProps>`
  ${({ theme }) => theme.transition('common', 'normal')}

  &:hover {
    opacity: 0.8;
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;
  font: inherit;
  color: inherit;
`;

export {
  StyledDrawer,
  StyledHeader,
  StyledNativeNavLink,
  StyledNavLink,
  StyledAnchor,
  StyledBackground,
  StyledContent,
  StyledLogoWrapper,
  StyledLayout,
  StyledMain
};
