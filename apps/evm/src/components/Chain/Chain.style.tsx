import { Flex, Span } from '@gobob/ui';
import styled from 'styled-components';

const StyledFlex = styled(Flex)`
  overflow: hidden;
`;

const StyledSpan = styled(Span)`
  text-overflow: ellipsis;
  overflow: hidden;
  color: inherit;
`;

export { StyledSpan, StyledFlex };
