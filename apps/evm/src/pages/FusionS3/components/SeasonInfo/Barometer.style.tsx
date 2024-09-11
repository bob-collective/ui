import { Span } from '@gobob/ui';
import styled from 'styled-components';

const StyledTrack = styled.div`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  border-top-right-radius: ${({ theme }) => theme.rounded('full')};
  border-bottom-right-radius: ${({ theme }) => theme.rounded('full')};
  background: ${({ theme }) => theme.color('grey-700')};
  height: ${({ theme }) => theme.spacing('xl')};
  border-left: 1px solid ${({ theme }) => theme.color('grey-700')};
`;

const StyledFilledTrack = styled.div`
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 100%;
  background: ${({ theme }) => theme.color('primary-400')};
  height: ${({ theme }) => theme.spacing('xl')};
  /* padding: ${({ theme }) => `${theme.spacing('3xl')} 0`}; */

  &:first-of-type {
    border-top-left-radius: ${({ theme }) => theme.rounded('full')};
    border-bottom-left-radius: ${({ theme }) => theme.rounded('full')};
    border-right: 1px solid ${({ theme }) => theme.color('grey-700')};
  }

  &:nth-of-type(2) {
    border-left: 1px solid ${({ theme }) => theme.color('grey-700')};
    border-right: 1px solid ${({ theme }) => theme.color('grey-700')};
  }
`;

const StyledTrackTitle = styled(Span)`
  position: absolute;
`;

const StyledTrackSubtitle = styled(Span)`
  position: absolute;
`;

const StyledFill = styled.div`
  border: none;
  transition: width 100ms;
  will-change: width;
  background: linear-gradient(270deg, #dd5500 0%, #f79254 100%);
  height: ${({ theme }) => theme.spacing('xl')};
`;

export { StyledTrack, StyledFilledTrack, StyledTrackTitle, StyledTrackSubtitle, StyledFill };
