import { Card, Flex } from '@gobob/ui';
import Slider from 'react-slick';
import styled, { css } from 'styled-components';

const StyledCard = styled(Card)`
  position: relative;
  text-decoration: none;
  overflow: hidden;
`;

const StyledBannerContent = styled(Flex)`
  z-index: 1;
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

const StyledSlider = styled(Slider)`
  .slick-prev {
    left: 0px;
  }
  .slick-next {
    right: 0px;
  }
`;

export { StyledCard, StyledSlider, StyledBannerContent, StyledBannerImg };
