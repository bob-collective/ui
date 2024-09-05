import styled, { css } from 'styled-components';
import Slider from 'react-slick';
import { Card, Chip } from '@gobob/ui';

import { CubsPath } from './CubsPath';

const StyledAvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const StyledCubsPath = styled(CubsPath)`
  width: 100%;
  height: auto;
`;

const StyledPrize = styled(Chip)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing('xl')};
  left: 50%;
  transform: translateX(-50%);
`;

const StyledQuestWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const StyledCard = styled(Card)``;

const StyledSlider = styled(Slider)`
  ${({ theme }) => {
    return css`
      margin-left: -${theme.spacing('s')};
      margin-right: -${theme.spacing('s')};
      /* @media ${theme.breakpoints.up('s')} {
        &:last-of-type {
          grid-column: span 2 / span 2;
        }
      } */

      .slick-prev {
        left: 20px;
      }

      .slick-next {
        right: 20px;
      }

      .slick-dots {
        /* bottom: 10px; */
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
  }}
`;

export { StyledAvatarWrapper, StyledPrize, StyledSlider, StyledQuestWrapper, StyledCubsPath, StyledCard };
