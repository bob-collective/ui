import styled, { css } from 'styled-components';

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

export { StyledBannerImg };
