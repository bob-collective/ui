import { Intract } from '@gobob/icons';
import { Card } from '@gobob/ui';
import styled from 'styled-components';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/${name}`, import.meta.url).href;
}

const StyledCard = styled(Card)`
  position: relative;
  background-image: url(${getImageUrl('welcome-season-3.jpg')});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  min-height: 260px;
`;

const StyledDescription = styled.div`
  &,
  span,
  p {
    color: ${({ theme }) => theme.color('grey-50')} !important;
    ${({ theme }) => theme.typography('md')}
  }
`;

const StyledIntract = styled(Intract)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
`;

const StyledOpacityOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(91.45deg, rgba(0, 0, 0, 0) 26.23%, rgba(0, 0, 0, 0.1) 63.34%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
`;

export { StyledCard, StyledIntract, StyledOpacityOverlay, StyledDescription };