import styled from 'styled-components';

const StyledTrack = styled.div`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  border-radius: ${({ theme }) => theme.rounded('full')};
  background: ${({ theme }) => theme.color('grey-700')};
  height: 18px;
  border: 1px solid ${({ theme }) => theme.color('grey-300')};
`;

const StyledFill = styled.div`
  border: none;
  transition: width 100ms;
  will-change: width;
  background: ${({ theme }) => `linear-gradient(270deg, ${theme.color('primary-500')} 0%, #FFF974 100%)`};
  height: 18px;
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledFillAddornment = styled.div`
  display: inline-flex;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: width 100ms;
  will-change: width;
  background-color: ${({ theme }) => theme.color('primary-600')};
  padding: ${({ theme }) => theme.spacing('xs')};
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledBarometer = styled.div`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing('3xl')} 0`};
  width: 100%;
`;

export { StyledTrack, StyledFill, StyledBarometer, StyledFillAddornment };
