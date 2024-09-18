import { Card, Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledSection = styled(Card)`
  width: 100%;
  overflow: hidden;
  max-height: calc(100vh - 16rem);
`;

const StyledStrategiesList = styled(Flex)`
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 7rem;
`;

export { StyledSection, StyledStrategiesList };
