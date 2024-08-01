import styled, { css } from 'styled-components';

import { Banner } from './Banner';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

const StyledBannerImg = styled.img`
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

export { StyledPressableBanner, StyledBannerImg };
