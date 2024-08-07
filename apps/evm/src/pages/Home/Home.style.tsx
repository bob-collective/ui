import { Flex, Main } from '@gobob/ui';
import styled, { css } from 'styled-components';

function getImageUrl(name: string) {
  return new URL(`../../assets/${name}`, import.meta.url).href;
}

const StyledMainContent = styled(Main)`
  position: relative;

  margin-top: -6.25rem;
`;

const StyledAboutSection = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing('4xl')};

  background-image: url(${getImageUrl('home-body-background.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
`;

const StyledContent = styled(Flex)`
  position: relative;
  flex-direction: column;
  max-width: 36rem;
  flex-direction: column;

  ${({ theme }) => css`
    margin: 0 auto;

    @media ${theme.breakpoints.up('md')} {
      max-width: ${({ theme }) => theme.maxWidth('7xl')};
    }
  `}
`;

const StyledPageFooter = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  max-height: 50rem;
  background-image: url(${getImageUrl('footer-background.png')});

  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50% 100%;
`;

export { StyledContent, StyledMainContent, StyledPageFooter, StyledAboutSection };
