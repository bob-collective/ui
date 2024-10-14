import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledQuestList = styled(Flex)`
  :last-child:not(:first-child) {
    margin-left: -${({ theme }) => theme.spacing('s')};
  }
`;

const StyledSkeletonWrapper = styled(Flex)`
  height: ${({ theme }) => theme.spacing('4xl')};
`;

export { StyledQuestList, StyledSkeletonWrapper };
