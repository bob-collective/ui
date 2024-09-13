import { Span } from '@gobob/ui';
import styled, { css } from 'styled-components';

const StyledTrack = styled.div`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  border-top-right-radius: ${({ theme }) => theme.rounded('xs')};
  border-bottom-right-radius: ${({ theme }) => theme.rounded('xs')};
  background: ${({ theme }) => theme.color('grey-700')};
  height: ${({ theme }) => theme.spacing('xl')};
  border-left: 1px solid ${({ theme }) => theme.color('grey-700')};
`;

const StyledFilledTrackWrapper = styled.div`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing('3xl')} 0`};
  width: 100%;
`;

const StyledFilledTrack = styled.div`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  background: ${({ theme }) => theme.color('primary-400')};
  height: ${({ theme }) => theme.spacing('xl')};
`;

const StyledFirstTrack = styled(StyledFilledTrack)`
  border-top-left-radius: ${({ theme }) => theme.rounded('xs')};
  border-bottom-left-radius: ${({ theme }) => theme.rounded('xs')};
  border-right: 1px solid ${({ theme }) => theme.color('grey-700')};
`;

const StyledSecondTrack = styled(StyledFilledTrack)`
  border-left: 1px solid ${({ theme }) => theme.color('grey-700')};
  border-right: 1px solid ${({ theme }) => theme.color('grey-700')};
`;

const StyledTrackTitle = styled(Span)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledTrackSubtitle = styled(Span)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  ${({ theme }) => {
    return css`
      visibility: hidden;

      @media ${theme.breakpoints.up('s')} {
        visibility: visible;
      }
    `;
  }}
`;

const StyledFill = styled.div`
  border: none;
  transition: width 100ms;
  will-change: width;
  background: ${({ theme }) =>
    `linear-gradient(270deg, ${theme.color('primary-600')} 0%, ${theme.color('primary-400')} 100%)`};
  height: ${({ theme }) => theme.spacing('xl')};
  border-top-right-radius: ${({ theme }) => theme.rounded('xs')};
  border-bottom-right-radius: ${({ theme }) => theme.rounded('xs')};
`;

const StyledBarometer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr 5fr;
`;

const StyledStepBar = styled.div`
  position: absolute;
  height: ${({ theme }) => theme.spacing('xl')};
  border: 1px solid ${({ theme }) => theme.color('light')};
  transform: translateX(-50%);
`;

const StyledStep = styled(Span)`
  bottom: 0;
  position: absolute;
`;

export {
  StyledTrack,
  StyledFirstTrack,
  StyledSecondTrack,
  StyledFilledTrackWrapper,
  StyledTrackTitle,
  StyledTrackSubtitle,
  StyledFill,
  StyledBarometer,
  StyledStep,
  StyledStepBar
};
