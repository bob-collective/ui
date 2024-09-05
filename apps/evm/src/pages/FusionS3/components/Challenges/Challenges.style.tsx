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
      margin-left: -${theme.spacing('lg')};
      margin-right: -${theme.spacing('lg')};

      @media ${theme.breakpoints.up('s')} {
        margin-left: -${theme.spacing('s')};
        margin-right: -${theme.spacing('s')};
      }
    `;
  }}
`;

export { StyledAvatarWrapper, StyledPrize, StyledSlider, StyledQuestWrapper, StyledCubsPath, StyledCard };
