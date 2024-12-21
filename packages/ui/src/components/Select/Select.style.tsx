import styled, { css } from 'styled-components';

import { InputSizes, Spacing } from '../../theme';
import { List } from '../List';
import { Span } from '../Text';
import { Flex } from '../Flex';
import { ChevronDown } from '../../icons';

type StyledTriggerProps = {
  $isOpen?: boolean;
  $size: InputSizes;
  $isDisabled: boolean;
  $isFocusVisible: boolean;
  $isHovered: boolean;
  $isFocused: boolean;
  $hasError: boolean;
  $hasValue: boolean;
};

type StyledTriggerValueProps = {
  $isDisabled?: boolean;
  $isSelected?: boolean;
};

type StyledFieldProps = {
  $disabled?: boolean;
  $maxWidth?: Spacing;
};

const StyledTrigger = styled.button<StyledTriggerProps>`
  ${({ theme, $size, $hasError, $isFocused, $isHovered, $isDisabled, $isFocusVisible }) => css`
    outline: ${!$isFocusVisible && 'none'};

    ${theme.select.wrapper}
    ${theme.select.sizes[$size].wrapper}
    ${$hasError && theme.select.error.wrapper}
    ${$isHovered ? ($hasError ? theme.select.error.hover.wapper : theme.select.hover.wapper) : undefined}
    ${$isFocused ? ($hasError ? theme.select.error.focus.wrapper : theme.select.focus.wrapper) : undefined}
    ${$isDisabled && theme.select.disabled.wrapper}
  `};
`;

const StyledTriggerInner = styled(Flex)<Pick<StyledTriggerProps, '$hasError'>>`
  ${({ theme, $hasError }) => css`
    width: 100%;

    ${theme.select.base}
    ${$hasError && theme.select.error.base}
  `};
`;

const StyledTriggerValue = styled(Span)<StyledTriggerValueProps>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  color: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: inherit;
  line-height: inherit;
  font-weight: inherit;
  cursor: pointer;
`;

const StyledList: any = styled(List)`
  ${({ theme }) => theme.tokenInput.list.base};
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${({ theme }) => theme.spacing('md')};
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  opacity: ${({ $disabled }) => $disabled && '.5'};
  max-width: ${({ $maxWidth, theme }) => $maxWidth && theme.spacing($maxWidth)};
`;

export { StyledField, StyledList, StyledTrigger, StyledChevronDown, StyledTriggerInner, StyledTriggerValue };
