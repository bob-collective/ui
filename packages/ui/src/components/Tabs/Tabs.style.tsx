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

  ${({ theme }) => theme.tabs.base};
  ${({ $size, theme }) => theme.tabs.size[$size].base};
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
};

const StyledTab = styled.div<StyledTabProps>`
  flex: ${({ $fullWidth }) => $fullWidth && '1'};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: ${({ $isDisabled }) => !$isDisabled && 'pointer'};
  user-select: none;
  outline: none;
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};
  text-overflow: ellipsis;
  position: relative;

  ${({ theme, $size }) => {
    return css`
      ${theme.tabs.item.base}
      ${theme.tabs.size[$size].item}
    `;
  }};
`;

type TabSelectionProps = {
  $isFocusVisible: boolean;
  $width: number;
  $transform: string;
  $size: TabsSize;
  $isHovered: boolean;
  $isFocusWithin: boolean;
};

const TabSelection = styled.div<TabSelectionProps>`
  position: absolute;
  top: ${({ $size, theme }) => theme.tabs.size[$size].base.padding};
  bottom: ${({ $size, theme }) => theme.tabs.size[$size].base.padding};
  left: 0;
  border-radius: ${({ theme }) => theme.tabs.item.base.borderRadius};
  background-color: ${({ theme }) => theme.tabs.item.base.backgroundColor};
  z-index: -1;

  width: ${(props) => props.$width}px;
  transform: ${(props) => props.$transform};

  ${({ theme, $isHovered, $isFocusWithin, $isFocusVisible, $size }) => {
    const sizeCss = theme.tabs.size[$size];

    return css`
      ${sizeCss.base}
      ${theme.tabs.item.selected}
      ${$isHovered && theme.tabs.item.hover}
      ${$isFocusWithin && theme.tabs.item.focus}
      
      ${$isFocusVisible &&
      css`
        &:after {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          z-index: 3;
          ${sizeCss.focusVisible}
        }
      `}
    `;
  }};
`;

export { StyledTab, StyledTabs, TabList, TabListWrapper, TabSelection };
