import styled, { CSSProperties, css } from 'styled-components';

import { Color } from '../../theme';
import { Flex } from '../Flex';
import { Rounded } from '../../theme';

type StyledListProps = {
  $maxHeight?: CSSProperties['maxHeight'];
};

const StyledList = styled(Flex)<StyledListProps>`
  max-height: ${({ $maxHeight }) => $maxHeight};
`;

type StyledListItemProps = {
  $isDisabled: boolean;
  $isHovered: boolean;
  $isInteractable: boolean;
  $isFocusVisible: boolean;
  $rounded?: Rounded;
  $backgroundColor?: Color;
};

const StyledListItem = styled.div<StyledListItemProps>`
  flex: 1;
  align-self: stretch;
  cursor: ${({ $isInteractable }) => $isInteractable && 'pointer'};
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
  opacity: ${({ $isDisabled }) => $isDisabled && 0.5};
  white-space: nowrap;
  background-color: ${({ $backgroundColor, theme }) => $backgroundColor && theme.color($backgroundColor)};

  ${({ theme, $rounded, $isHovered }) => {
    return css`
      ${theme.list.item.base}
      border-radius: ${$rounded && theme.rounded($rounded)};
      ${$isHovered && theme.list.item.hover}

      &[aria-selected='true'] {
        ${theme.list.item.selected};
      }
    `;
  }}
`;

export { StyledList, StyledListItem };
