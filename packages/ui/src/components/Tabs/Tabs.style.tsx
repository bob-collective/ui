import styled, { css } from 'styled-components';

import { TabsSize } from '../../theme';
import { AlignItems } from '../../theme';
import { hideScrollbar } from '../utils/visually-hidden';

const StyledTabs = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type TabListWrapperProps = {
  $fullWidth: boolean;
  $size: TabsSize;
  $align: AlignItems;
};

const TabListWrapper = styled.div<TabListWrapperProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  align-self: ${({ $align, $fullWidth }) => !$fullWidth && $align};
  position: relative;
  z-index: 0;
  max-width: 100%;
  overflow-x: auto;

  ${hideScrollbar()}

  ${({ theme }) => theme.tabs.wrapper};
`;

type TabListProps = {
  $fullWidth: boolean;
};

const TabList = styled.div<TabListProps>`
  display: ${({ $fullWidth }) => ($fullWidth ? 'flex' : 'inline-flex')};
  width: 100%;
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
`;

export { StyledTab, StyledTabs, TabList, TabListWrapper, TabSelection };
