import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { StyledTrigger } from '../Select/Select.style';
import { Span } from '../Text';
import { Divider } from '../Divider';
import { Button } from '../Button';

import { Token } from './Token';

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
  ${({ theme, $isInvalid }) => css`
    ${theme.tokenInput.base}
    ${$isInvalid && theme.input.error.base}

    &::placeholder {
      ${theme.tokenInput.placeholder}
    }
  `}
`;

const StyledBaseTokenInputWrapper = styled(Flex)<StyledFieldProps>`
  ${({ theme, $isInvalid, $isFocused, $isHovered, $isDisabled }) => css`
    ${theme.tokenInput.wrapper}
    ${$isInvalid && theme.tokenInput.error.wrapper}
    ${$isHovered ? ($isInvalid ? theme.tokenInput.error.hover.wapper : theme.tokenInput.hover.wapper) : undefined}
    ${$isFocused ? ($isInvalid ? theme.tokenInput.error.focus.wrapper : theme.tokenInput.focus.wrapper) : undefined}
    ${$isDisabled && theme.input.disabled.wrapper}
  `}
`;

const StyledInputWrapper = styled(Flex)`
  ${({ theme }) => css`
    ${theme.tokenInput.inputWrapper}
  `}
`;

const StyledDivider = styled(Divider)`
  ${({ theme }) => css`
    ${theme.tokenInput.divider}
  `}
`;

const StyledBottomWrapper = styled(Flex)`
  ${({ theme }) => css`
    ${theme.tokenInput.bottomWrapper}
  `}
`;

const StyledBalanceButton = styled(Button)`
  ${({ theme }) => css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing('xs')};
    height: auto;
    ${theme.tokenInput.balance}
  `}
`;

const StyledUSDAdornment = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ theme }) => theme.tokenInput.usd}
`;

const StyledTokenImg = styled.img`
  ${({ theme }) => theme.tokenInput.token.img}
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledFixedTokenAdornment = styled(Token)`
  ${({ theme }) => css`
    ${theme.tokenInput.token.base}
    border: 1px solid ${theme.color('grey-300')};
    height: 2.5rem;
    border-radius: ${theme.rounded('full')};
  `}
`;

const StyledTokenSelect = styled(StyledTrigger)`
  border-radius: ${({ theme }) => theme.rounded('full')};
  ${({ theme, ...props }) => css`
    ${theme.tokenInput.token.base}
    ${!(props as any)['data-value'] && theme.tokenInput.token.placeholder}
    height: 2.5rem;
  `}
`;

const StyledListItemLabel = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  ${({ theme }) => theme.tokenInput.list.item.ticker};
`;

const StyledListItemUsd = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  ${({ theme }) => theme.tokenInput.list.item.usd};
`;

const StyledListItemTokenImg = styled.img`
  ${({ theme }) => theme.tokenInput.list.item.img}
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledListTokenWrapper = styled(Flex)`
  overflow: hidden;
`;

export {
  StyledListItemLabel,
  StyledListTokenWrapper,
  StyledTokenSelect,
  StyledTokenImg,
  StyledListItemUsd,
  StyledBaseInput,
  StyledBaseTokenInputWrapper,
  StyledBalanceButton,
  StyledUSDAdornment,
  StyledInputWrapper,
  StyledBottomWrapper,
  StyledDivider,
  StyledListItemTokenImg,
  StyledFixedTokenAdornment
};
