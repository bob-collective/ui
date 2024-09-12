import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledSpiceChipWrapper = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing('md')};
  right: ${({ theme }) => theme.spacing('md')};
`;

const StyledCardHeader = styled(Flex)`
  position: relative;
  background: ${({ theme }) =>
    `linear-gradient(270deg, ${theme.color('grey-400')} 0%, ${theme.color('grey-600')} 100%)`};
`;

const StyledSocialsWrapper = styled(Flex)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing('md')};
  right: ${({ theme }) => theme.spacing('lg')};
`;

export { StyledSocialsWrapper, StyledCardHeader, StyledSpiceChipWrapper };
