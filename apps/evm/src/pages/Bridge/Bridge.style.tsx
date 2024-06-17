import { Button, Card, Flex } from '@gobob/ui';
import styled, { css } from 'styled-components';

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

const StyledBannerImg = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  opacity: 0.5;
  ${({ theme }) => {
    return css`
      transform: scale(4);
      @media ${theme.breakpoints.up('s')} {
        transform: scale(6) translateX(-15%);
      }
    `;
  }}
`;

const StyledBannerCloseBtn = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing('s')};
  right: ${({ theme }) => theme.spacing('s')};
  z-index: 2;
`;

export { StyledFlex, StyledCard, StyledBannerImg, StyledBannerContent, StyledBannerCloseBtn, StyledBanner };
