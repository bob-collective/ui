import { Card, Flex } from '@gobob/ui';
import Slider from 'react-slick';
import styled, { css } from 'styled-components';

import { EcosystemImg } from './EcosystemImg';
import { IntractImg } from './IntractImg';
import { OnrampImg } from './OnrampImg';

const StyledCarouselWrapper = styled(Card)`
  position: relative;
  text-decoration: none;
  overflow: hidden;
`;

const StyledBannerContent = styled(Flex)`
  z-index: 1;
`;

const StyledSlider = styled(Slider)`
  .slick-prev {
    left: 20px;
  }

  .slick-next {
    right: 20px;
  }

  .slick-dots {
    bottom: 10px;
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

const StyledBanner = styled(Card)`
  position: relative;
  max-height: 8.5rem;
`;

const StyledIntractImg = styled(IntractImg)`
  ${({ theme }) => {
    return css`
      position: absolute;
      top: 50%;
      right: 3.275rem;
      width: 14rem;
      height: 14rem;
      transform: translateY(-50%);

      @media ${theme.breakpoints.down('md')} {
        left: 50%;
        right: unset;
        transform: translate(-50%, -50%);
        opacity: 0.2;
      }
    `;
  }}
`;

const StyledOnrampImg = styled(OnrampImg)`
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

const StyledEcosystemImg = styled(EcosystemImg)`
  ${({ theme }) => {
    return css`
      position: absolute;
      top: 50%;
      right: 0.275rem;
      width: 26rem;
      height: 26rem;
      transform: translateY(-50%);

      @media ${theme.breakpoints.down('md')} {
        left: 50%;
        right: unset;
        transform: translate(-50%, -50%);
        opacity: 0.2;
      }
    `;
  }}
`;

export {
  StyledCarouselWrapper,
  StyledSlider,
  StyledBanner,
  StyledEcosystemImg,
  StyledOnrampImg,
  StyledIntractImg,
  StyledBannerContent
};
