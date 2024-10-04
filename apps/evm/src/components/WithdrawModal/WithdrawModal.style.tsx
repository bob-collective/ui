import { Dt, Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledDt = styled(Dt)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-height: ${({ theme }) => theme.typography('s').lineHeight};
`;

const StyledTooltipWrapper = styled(Flex)`
  margin-left: ${({ theme }) => theme.spacing('md')};
`;

export { StyledDt, StyledTooltipWrapper };
