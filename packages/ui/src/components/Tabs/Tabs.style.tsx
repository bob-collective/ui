import styled, { css } from 'styled-components';

import { TabsSize, TabsVariant } from '../../theme';
import { AlignItems } from '../../theme';
import { hideScrollbar } from '../utils/visually-hidden';

type StyledTabsProps = {
  $fullHeight?: boolean;
};

const StyledTabs = styled.div<StyledTabsProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${({ $fullHeight }) => $fullHeight && '100%'};
`;

type TabListProps = {
  $fullWidth: boolean;
  $size: TabsSize;
  $align: AlignItems;
  $variant: TabsVariant;
};

const TabList = styled.div<TabListProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  align-self: ${({ $align, $fullWidth }) => !$fullWidth && $align};
  position: relative;
  z-index: 0;
  max-width: 100%;
  overflow-x: auto;

  ${hideScrollbar()}

  ${({ theme }) => theme.tabs.wrapper};
  ${({ theme, $variant }) => theme.tabs.variant[$variant].wrapper};
`;

type StyledTabProps = {
  $fullWidth: boolean;
  $size: TabsSize;
  $isDisabled: boolean;
  $isFocusVisible: boolean;
};

const StyledTab = styled.div<StyledTabProps>`
  flex: ${({ $fullWidth }) => $fullWidth && '1'};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: ${({ $isDisabled }) => !$isDisabled && 'pointer'};
  user-select: none;
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};
  text-overflow: ellipsis;
  position: relative;
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
  white-space: nowrap;

  ${({ theme, $size }) => css`
    ${theme.tabs.tab.base}
    ${theme.tabs.size[$size].tab.base}

      &:hover:not([aria-selected=true]):not([aria-disabled=true]) {
      ${theme.tabs.tab.hover}
    }
  `};
`;

type TabSelectionProps = {
  $width: number;
  $transform: string;
  $size: TabsSize;
  $isHovered: boolean;
  $isFocusWithin: boolean;
  $variant: TabsVariant;
};

const TabSelection = styled.div<TabSelectionProps>`
  position: absolute;
  left: 0;
  border-radius: ${({ theme }) => theme.tabs.tab.base.borderRadius};
  background-color: ${({ theme }) => theme.tabs.tab.base.backgroundColor};
  z-index: -1;
  width: ${(props) => props.$width}px;
  transform: ${(props) => props.$transform};

  ${({ theme }) => theme.tabs.tab.selected};
  ${({ theme, $variant }) => theme.tabs.variant[$variant].tab.selected};
`;

export { StyledTab, StyledTabs, TabList, TabSelection };
