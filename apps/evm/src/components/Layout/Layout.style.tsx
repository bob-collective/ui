import { Flex, MaxWidth, ResponsiveProp, Spacing, Span } from '@gobob/ui';
import Link from 'next/link';
import styled, { css } from 'styled-components';

type StyledMainProps = {
  $maxWidth?: ResponsiveProp<MaxWidth>;
  $padding: Spacing;
};

const StyledLayout = styled(Flex)`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color('grey-600')};
`;

const StyledHeader = styled(Flex)`
  width: 100%;
  padding-right: ${({ theme }) => theme.spacing('3xl')};
  z-index: 20;
  margin: 0 auto;
`;

const StyledLogoWrapper = styled(Flex)`
  height: 76px;
  padding-left: ${({ theme }) => theme.spacing('3xl')};
`;

const StyledMain = styled.main<StyledMainProps>`
  width: 100%;
  overflow-x: hidden;
  padding: ${({ theme, $padding }) => theme.spacing($padding)};
  margin-left: auto;
  margin-right: auto;
  position: relative;

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

const StyledNativeNavLink = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledNavLink = styled(Span)`
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

export { StyledAnchor, StyledHeader, StyledLayout, StyledLogoWrapper, StyledMain, StyledNativeNavLink, StyledNavLink };
