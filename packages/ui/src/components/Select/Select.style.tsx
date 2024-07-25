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
  outline: none;
  letter-spacing: inherit;
  background: none;

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;

  cursor: ${({ $isDisabled }) => !$isDisabled && 'pointer'};

  ${({ theme, $size, $hasError, $isFocused, $isHovered }) => css`
    width: 100%;
    height: 100%;
    border-radius: ${theme.rounded('md')};
    border-style: solid;
    border-width: 1px;

    ${theme.transition('common', 'normal')}

    ${theme.input.sizes[$size]}

    ${theme.input.base}
    ${$hasError && theme.input.error.base}

    ${theme.input.wrapper}
    ${$hasError && theme.input.error.wrapper}
    ${$isHovered ? ($hasError ? theme.input.error.hover.wapper : theme.input.hover.wapper) : undefined}
    ${$isFocused ? ($hasError ? theme.input.error.focus.wrapper : theme.input.focus.wrapper) : undefined}
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
`;

const StyledList: any = styled(List)`
  ${({ theme }) => theme.tokenInput.list.base};

  > :last-child {
    margin-bottom: ${({ theme }) => theme.spacing('lg')};
  }
`;

const StyledChevronDown = styled(ChevronDown)`
  margin-left: ${({ theme }) => theme.spacing('md')};
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  opacity: ${({ $disabled }) => $disabled && '.5'};
  max-width: ${({ $maxWidth, theme }) => $maxWidth && theme.spacing($maxWidth)};
`;

export { StyledField, StyledList, StyledTrigger, StyledChevronDown, StyledTriggerValue };
