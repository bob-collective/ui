import { Flex, MaxWidth, ResponsiveProp, Spacing } from '@gobob/ui';
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

export { StyledHeader, StyledLayout, StyledLogoWrapper, StyledMain };