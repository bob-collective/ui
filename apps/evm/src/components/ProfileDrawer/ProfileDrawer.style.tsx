import { Flex, Tabs } from '@gobob/ui';
import styled from 'styled-components';
import { css } from 'styled-components';

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

const StyledTabs = styled(Tabs)`
  height: 100%;

  [role='tabpanel'] {
    height: 100%;
    width: 100%;
    position: relative;

    ${({ theme }) => {
      return css`
        @media ${theme.breakpoints.down('s')} {
          min-height: 20vh;
          max-height: 20vh;
        }
      `;
    }}
  }
`;

export { StyledTabs, SyledWrapper };
