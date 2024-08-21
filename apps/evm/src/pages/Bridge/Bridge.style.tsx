import { Button, Card, Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledFlex = styled(Flex)`
  width: 100%;
`;

const StyledCard = styled(Card)`
  width: 100%;
`;

const StyledBannerContent = styled(Flex)`
  z-index: 1;
`;

const StyledBanner = styled(Card)`
  position: relative;
  text-decoration: none;
  overflow: hidden;
`;

const StyledBannerCloseBtn = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing('s')};
  right: ${({ theme }) => theme.spacing('s')};
  z-index: 2;
`;

export { StyledFlex, StyledCard, StyledBannerContent, StyledBannerCloseBtn, StyledBanner };
