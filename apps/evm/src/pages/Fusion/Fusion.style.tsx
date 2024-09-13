import styled from 'styled-components';

function getImageUrl(name: string) {
  return new URL(`../../assets/${name}`, import.meta.url).href;
}

const StyledBackground = styled.div`
  position: absolute;
  top: 0;
  height: 32rem;
  width: 100%;

  background-image: url(${getImageUrl('podyum-background.png')});
  background-repeat: no-repeat;
  background-size: cover;
`;

const StyledBackgroundOpacity = styled.div`
  position: absolute;
  top: 0;
  height: 32rem;
  width: 100%;

  background: ${({ theme }) => `linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, ${theme.color('grey-600')} 100%)`};
`;

export { StyledBackground, StyledBackgroundOpacity };
