import { Flex } from '@gobob/ui';
import styled, { css } from 'styled-components';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

const StyledHeroSection = styled(Flex)`
  position: relative;
  min-height: calc(100vh + 1.5rem);

  ${({ theme }) => css`
    @media ${theme.breakpoints.up('md')} {
      margin-top: 0;

      min-height: calc(100vh - 12.125rem);
    }

    @media ${theme.breakpoints.up('lg')} {
      margin-top: 0;

      min-height: calc(100vh - 8rem);
    }
  `}
`;

const StyledAuthCardWrapper = styled(Flex)`
  position: relative;
  margin-top: 6.25rem;
  margin-bottom: 2rem;

  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;

  ${({ theme }) => css`
    @media ${theme.breakpoints.up('md')} {
      width: 100%;
      max-width: ${({ theme }) => theme.maxWidth('7xl')};
    }
  `}
`;

const StyledHeroBackground = styled.div`
  position: absolute;
  width: 100%;
  inset: 0;

  ${({ theme }) => css`
    @media ${theme.breakpoints.up('md')} {
      max-height: unset;

      min-height: calc(100vh - 12.125rem);
    }

    @media ${theme.breakpoints.up('lg')} {
      min-height: calc(100vh - 8rem);
    }
  `}
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  user-select: none;
`;

const StyledLockedAmount = styled.h2`
  display: flex;

  position: absolute;
  padding: ${({ theme }) =>
    `${theme.spacing('2xl')} ${theme.spacing('7xl')} ${theme.spacing('2xl')} ${theme.spacing('9xl')}`};
  gap: ${({ theme }) => theme.spacing('md')};

  right: 0;
  bottom: 0;
  background-image: url(${getImageUrl('hero-addornment.svg')});
  background-repeat: no-repeat;
  background-size: cover;
`;

export { StyledAuthCardWrapper, StyledHeroBackground, StyledHeroSection, StyledLockedAmount, StyledVideo };
