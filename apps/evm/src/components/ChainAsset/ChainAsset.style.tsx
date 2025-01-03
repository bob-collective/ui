import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledWrapper = styled(Flex)`
  position: relative;
  display: inline-flex;
  width: max-content;
  height: fit-content;
`;

const StyledChain = styled.span`
  display: inline-flex;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid ${({ theme }) => theme.color('grey-400')};
  background-color: ${({ theme }) => theme.color('grey-400')};
  border-radius: ${({ theme }) => theme.rounded('full')};
  overflow: hidden;
  transform: translate(25%, 25%);
`;

export { StyledWrapper, StyledChain };
