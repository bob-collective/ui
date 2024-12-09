import { Flex } from '@gobob/ui';
import styled, { css } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SyledWrapper = styled(Flex)<{ snap: any }>`
  background: ${({ theme }) => theme.color('grey-400')};
  border-radius: ${({ theme }) => theme.rounded('lg')};
  ${({ snap }) => css`
    // @ts-expect-error
    overflow-y: ${snap === 1 ? 'auto' : undefined};
    overflow: ${snap !== 1 ? 'hidden' : undefined};
  `}
`;

const StyledTokenList = styled(Flex)`
  overflow-y: auto;
  inset: 0;
`;

export { StyledTokenList, SyledWrapper };
