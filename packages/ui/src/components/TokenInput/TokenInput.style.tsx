import styled, { css } from 'styled-components';

import { Flex } from '../Flex';
import { StyledTrigger } from '../Select/Select.style';
import { Span } from '../Text';

type StyledListItemSelectedLabelProps = {
  $isSelected: boolean;
};

const StyledTokenImg = styled.img`
  ${({ theme }) => theme.tokenInput.token.img}
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledTokenSelect = styled(StyledTrigger)`
  border-radius: ${({ theme }) => theme.rounded('full')};
  ${({ theme, ...props }) => css`
    ${theme.tokenInput.token.base}
    ${!(props as any)['data-value'] && theme.tokenInput.token.placeholder}
    height: 2.5rem;
  `}
`;

const StyledListItemLabel = styled(Span)<StyledListItemSelectedLabelProps>`
  text-overflow: ellipsis;
  overflow: hidden;

  ${({ theme, $isSelected }) => {
    return css`
      ${theme.tokenInput.list.item.ticker}
      ${$isSelected && theme.tokenInput.list.item.selected.ticker}
    `;
  }}
`;

const StyledListItemUsd = styled(Span)<StyledListItemSelectedLabelProps>`
  text-overflow: ellipsis;
  overflow: hidden;

  ${({ theme, $isSelected }) => {
    return css`
      ${theme.tokenInput.list.item.usd}
      ${$isSelected && theme.tokenInput.list.item.selected.usd}
    `;
  }}
`;

const StyledListTokenWrapper = styled(Flex)`
  overflow: hidden;
`;

export { StyledListItemLabel, StyledListTokenWrapper, StyledTokenSelect, StyledTokenImg, StyledListItemUsd };
