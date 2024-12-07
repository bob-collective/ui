import { Card, Flex, H1 } from '@gobob/ui';
import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import styled, { css } from 'styled-components';

const StyledCarouselWrapper = styled(Card)`
  position: relative;
  text-decoration: none;
  overflow: hidden;
  max-height: 8.5rem;
`;

const StyledBannerContent = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('md')};
  z-index: 1;
`;

const StyledCarousel = styled(Carousel)`
  min-height: 8.5rem;
  height: 100%;

  .react-multi-carousel-dot-list {
    .react-multi-carousel-dot.react-multi-carousel-dot--active button {
      background-color: ${({ theme }) => theme.color('primary-500')};
      opacity: 1;
    }

    .react-multi-carousel-dot button {
      background-color: ${({ theme }) => theme.color('grey-200')};
      border: none;
      opacity: 0.7;
      width: 10px;
      height: 10px;
      padding-top: 1px;
      padding-bottom: 1px;
    }
  }

  .react-multiple-carousel__arrow--left {
    left: calc(2% + 1px);
    min-width: ${({ theme }) => theme.spacing('4xl')};
    min-height: ${({ theme }) => theme.spacing('4xl')};
  }

  .react-multiple-carousel__arrow--right {
    right: calc(2% + 1px);
    min-width: ${({ theme }) => theme.spacing('4xl')};
    min-height: ${({ theme }) => theme.spacing('4xl')};
  }

  .react-multiple-carousel__arrow:before {
    font-size: ${({ theme }) => theme.spacing('lg')};
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

const StyledFusionImg = styled(Image)`
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

const StyledHybridL2Img = styled(Image)`
  ${({ theme }) => {
    return css`
      position: absolute;
      top: 50%;
      right: 3rem;
      width: 21rem;
      transform: translateY(-50%);
      right: ${theme.spacing('xl')};

      @media ${theme.breakpoints.down('md')} {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.2;
      }
    `;
  }}
`;

const StyledXImg = styled(Image)`
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
  StyledBanner,
  StyledBannerContent,
  StyledBannerTitle,
  StyledCarousel,
  StyledCarouselWrapper,
  StyledFusionImg,
  StyledXImg,
  StyledHybridL2Img
};
