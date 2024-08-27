import { Card, Flex, H3 } from '@gobob/ui';
import styled from 'styled-components';

const StyledList = styled(Card)`
  border-top-left-radius: 0px;
  overflow-x: auto;
`;

const StyledWrapper = styled(Flex)`
  margin-bottom: -1px;
`;

const StyledH3 = styled(H3)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledHeaderWrapper = styled(Card)`
  border-right: none;
  height: 3rem;
  z-index: 1;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
`;

export { StyledList, StyledHeaderWrapper, StyledH3, StyledWrapper };
