import { Card, Flex } from '@gobob/ui';
import Slider from 'react-slick';
import styled, { css } from 'styled-components';

import { Banner } from './Banner';
import { OnrampGraphic } from './OnrampGraphic';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

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
    color: ${({ theme }) => theme.color('grey-300')};
    width: auto;
    height: auto;
    z-index: 1;
    transition: ${({ theme }) => theme.transition('colors', 'fast')};

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
    color: ${({ theme }) => theme.color('grey-100')};
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

const StyledOnrampBanner = styled(Banner)`
  background-image: url(${getImageUrl('cubs-group.svg')});
  background-repeat: no-repeat;
  background-size: cover;

  ${({ theme }) => {
    return css`
      background-position: 70% 50%;

      @media ${theme.breakpoints.up('s')} {
        background-position: 0% 50%;
      }
    `;
  }}
`;

const StyledPressableBanner = styled(Banner)`
  background-image: url(${getImageUrl('cubs-group.svg')});
  background-repeat: no-repeat;
  background-size: cover;

  position: relative;

  ${({ theme }) => {
    return css`
      background-position: 70% 50%;

      @media ${theme.breakpoints.up('s')} {
        background-position: 0% 50%;
      }
    `;
  }}
`;

const StyledIntractBannerImg = styled.img`
  ${({ theme }) => {
    return css`
      height: 4rem;

      @media ${theme.breakpoints.down('s')} {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.2;
      }
    `;
  }}
`;

const StyledOnrampGraphic = styled(OnrampGraphic)`
  ${({ theme }) => {
    return css`
      height: 4rem;

      @media ${theme.breakpoints.down('s')} {
        position: absolute;
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
`;

export {
  StyledCarouselWrapper,
  StyledSlider,
  StyledOnrampBanner,
  StyledOnrampGraphic,
  StyledBannerContent,
  StyledBanner,
  StyledBannerImg,
  StyledPressableBanner,
  StyledIntractBannerImg
};
