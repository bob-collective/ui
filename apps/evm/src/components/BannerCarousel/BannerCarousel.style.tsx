import { Card, Flex, H1 } from '@gobob/ui';
import Slider from 'react-slick';
import styled, { css } from 'styled-components';

const StyledCarouselWrapper = styled(Card)`
  position: relative;
  text-decoration: none;
  overflow: hidden;
`;

const StyledBannerContent = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('md')};
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

const StyledBannerTitle = styled(H1)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledFusionImg = styled.img`
  ${({ theme }) => {
    return css`
      position: absolute;
      top: 50%;
      right: 0;
      width: 21rem;
      transform: translateY(-50%);
      @media ${theme.breakpoints.down('md')} {
        opacity: 0.2;
      }
    `;
  }}
`;

const StyledXImg = styled.img`
  ${({ theme }) => {
    return css`
      position: absolute;
      top: 46%;
      right: 1.5rem;
      width: 21rem;
      transform: translateY(-50%);
      @media ${theme.breakpoints.down('md')} {
        opacity: 0.2;
      }
    `;
  }}
`;

export {
  StyledCarouselWrapper,
  StyledSlider,
  StyledBanner,
  StyledFusionImg,
  StyledXImg,
  StyledBannerContent,
  StyledBannerTitle
};
