import styled from 'styled-components';

import { ChevronDown } from '../../icons';
import { InputSizes } from '../../theme';
import { List } from '../List';
import { Span } from '../Text';
import { Flex } from '../Flex';

type StyledTriggerProps = {
  $isOpen?: boolean;
  $size: InputSizes;
  $isDisabled: boolean;
  $hasError: boolean;
  $hasValue: boolean;
};

type StyledTriggerValueProps = {
  $isDisabled?: boolean;
  $isSelected?: boolean;
};

type StyledFieldProps = {
  $disabled?: boolean;
};

const StyledTrigger = styled.button<StyledTriggerProps>`
  outline: none;
  letter-spacing: inherit;
  background: none;

  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;

  cursor: ${({ $isDisabled }) => !$isDisabled && 'pointer'};
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
`;

export { StyledField, StyledChevronDown, StyledList, StyledTrigger, StyledTriggerValue };
