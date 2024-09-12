import { Button, Flex } from '@gobob/ui';
import styled, { css } from 'styled-components';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

const StyledBackground = styled.div`
  position: absolute;
  background-image: url(${getImageUrl('welcome-season-3.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  inset: 0;
  z-index: 0;
  opacity: 0.6;
`;

const StyledContent = styled(Flex)`
  z-index: 1;
`;

const StyledLearnButton = styled(Button)`
  ${({ theme }) => {
    return css`
      width: 100%;

      @media ${theme.breakpoints.up('s')} {
        width: 35%;
      }
    `;
  }}
`;

export { StyledBackground, StyledContent, StyledLearnButton };
