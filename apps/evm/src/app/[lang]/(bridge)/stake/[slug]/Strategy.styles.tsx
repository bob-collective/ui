import { Flex, H2 } from '@gobob/ui';
import Image from 'next/image';
import styled, { css } from 'styled-components';

const StyledBannerContent = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('2xl')};
  z-index: 1;
`;

const StyledBannerTitle = styled(H2)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledBannerImg = styled(Image)`
  ${({ theme }) => {
    return css`
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      @media ${theme.breakpoints.down('md')} {
        opacity: 0.2;
      }
    `;
  }}
`;

export { StyledBannerImg, StyledBannerContent, StyledBannerTitle };
