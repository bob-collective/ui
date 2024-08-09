import { Card, Flex } from '@gobob/ui';
import Slider from 'react-slick';
import styled, { css } from 'styled-components';

import { OnrampGraphic } from './OnrampGraphic';

const StyledCarouselWrapper = styled(Card)`
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
    left: 10px;
  }

  .slick-next {
    right: 10px;
  }

  .slick-dots {
    bottom: 0;
  }

  .slick-prev,
  .slick-next {
    color: ${({ theme }) => theme.color('grey-200')};
    width: ${({ theme }) => theme.spacing('4xl')};
    height: ${({ theme }) => theme.spacing('4xl')};
    z-index: 1;
    transition: ${({ theme }) => theme.transition('colors', 'fast')};
    border-radius: ${({ theme }) => theme.rounded('md')};

    &,
    &:hover,
    &:focus,
    &:active {
      background-color: ${({ theme }) => theme.color('grey-600')};
    }

    &:hover {
      opacity: 0.7;
    }

    &::before {
      content: unset;
    }
  }

  .slick-dots li.slick-active button:before {
    color: ${({ theme }) => theme.color('primary-500')};
    opacity: 1;
  }

  .slick-dots li button:before {
    font-size: 10px;
    color: ${({ theme }) => theme.color('grey-200')};
    transition: ${({ theme }) => theme.transition('colors', 'fast')};
  }

  .slick-dots li {
    margin: 0 3px;
  }

  .slick-prev:hover,
  .slick-prev:focus,
  .slick-next:hover,
  .slick-next:focus {
    color: ${({ theme }) => theme.color('grey-200')};
  }
`;

const StyledOnrampGraphic = styled(OnrampGraphic)`
  position: absolute;

  ${({ theme }) => {
    return css`
      height: 4rem;
      right: ${theme.spacing('7xl')};

      @media ${theme.breakpoints.down('md')} {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* height: 3rem; */
        opacity: 0.2;
      }
    `;
  }}
`;

const StyledBanner = styled(Card)`
  position: relative;
  max-height: 8.5rem;
`;

export { StyledCarouselWrapper, StyledSlider, StyledOnrampGraphic, StyledBannerContent, StyledBanner, StyledBannerImg };
