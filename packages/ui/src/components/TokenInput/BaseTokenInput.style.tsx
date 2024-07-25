import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { Button } from '../Button';

type StyledUSDAdornmentProps = {
  $isDisabled?: boolean;
};

type StyledBaseInputProps = {
  $isInvalid: boolean;
};

type StyledFieldProps = {
  $isHovered: boolean;
  $isFocused: boolean;
  $isInvalid: boolean;
  $isDisabled?: boolean;
};

const StyledBaseInput = styled.input<StyledBaseInputProps>`
  display: block;
  width: 100%;

  outline: none;
  font: inherit;
  letter-spacing: inherit;
  background: none;

  text-overflow: ellipsis;

  border: none;

  margin: 0;
  padding: 0;

  ${({ theme, $isInvalid }) => css`
    ${theme.tokenInput.base}
    ${$isInvalid && theme.input.error.base}

    &::placeholder {
      ${theme.tokenInput.placeholder}
    }
  `}
`;

const StyledAdornment = styled.div`
  display: inline-flex;
  align-items: center;
  position: absolute;
  // to not allow adornment to take more than 50% of the input. We might want to reduce this in the future.
  bottom: ${({ theme }) => theme.spacing('s')};
  overflow: hidden;
  z-index: 1;
  z-index: 5;

  pointer-events: none;
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  opacity: ${({ $isDisabled }) => $isDisabled && '.5'};
  ${({ theme, $isInvalid, $isFocused, $isHovered }) => css`
    width: 100%;
    height: 100%;
    border-radius: ${theme.rounded('md')};
    border-style: solid;
    border-width: 1px;

    ${theme.transition('common', 'normal')}

    ${theme.tokenInput.wrapper}
    ${$isInvalid && theme.tokenInput.error.wrapper}
    ${$isHovered ? ($isInvalid ? theme.tokenInput.error.hover.wapper : theme.tokenInput.hover.wapper) : undefined}
    ${$isFocused ? ($isInvalid ? theme.tokenInput.error.focus.wrapper : theme.tokenInput.focus.wrapper) : undefined}
  `}
`;

const StyledBalanceButton = styled(Button)`
  ${({ theme }) => css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing('xxs')};
    height: auto;
    ${theme.tokenInput.balance}
  `}
`;

const StyledUSDAdornment = styled.span<StyledUSDAdornmentProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ theme }) => theme.tokenInput.usd}
`;

export { StyledBaseInput, StyledAdornment, StyledField, StyledBalanceButton, StyledUSDAdornment };
