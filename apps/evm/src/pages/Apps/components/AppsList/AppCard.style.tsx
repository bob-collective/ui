import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledImgWrapper = styled(Flex)`
  position: relative;
  background: radial-gradient(81.15% 494.89% at 46.85% 41.99%, #474d58 0%, #1e2430 18.5%, #040404 57.5%);
`;

const StyledSpiceChipWrapper = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing('md')};
  right: ${({ theme }) => theme.spacing('md')};
`;

const StyledAnchor = styled.a`
  text-decoration: none;
  display: flex;
`;

export { StyledImgWrapper, StyledAnchor, StyledSpiceChipWrapper };
