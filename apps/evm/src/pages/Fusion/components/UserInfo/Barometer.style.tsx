import { Flex, SolidGift, Span } from '@gobob/ui';
import styled from 'styled-components';

const StyledTrack = styled.div`
  overflow: hidden;
  z-index: 1;
  width: 100%;
  border-radius: ${({ theme }) => theme.rounded('full')};
  background: ${({ theme }) => theme.color('grey-700')};
  height: 22px;
  border: 1px solid ${({ theme }) => theme.color('grey-300')};
`;

const StyledFill = styled.div`
  border: none;
  transition: width 100ms;
  will-change: width;
  background: ${({ theme }) => `linear-gradient(270deg, ${theme.color('primary-500')} 0%, #FFF974 100%)`};
  height: 22px;
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledFillAddornment = styled.div`
  display: inline-flex;
  position: absolute;
  top: 50%;
  transform: translate(-100%, -50%);
  transition: width 100ms;
  will-change: width;
  background-color: ${({ theme }) => theme.color('primary-500')};
  padding: ${({ theme }) => theme.spacing('xs')};
  border-radius: ${({ theme }) => theme.rounded('full')};
  z-index: 1;
  box-shadow: 0 0 20px 2px ${({ theme }) => theme.color('primary-700')};
`;

const StyledValue = styled(Span)`
  display: inline-flex;
  position: absolute;
  transition: width 100ms;
  will-change: width;
  top: -14px;
  left: 50%;
  background-color: ${({ theme }) => theme.color('primary-500')};
  padding: ${({ theme }) => `${theme.spacing('xxs')} ${theme.spacing('md')}`};
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledBarometer = styled.div`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing('4xl')} 0`};
  margin-top: ${({ theme }) => theme.spacing('md')};
  width: 100%;
`;

const StyledGift = styled(SolidGift)`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
`;

const StyledStep = styled(Flex)`
  position: absolute;
  right: 0;
  margin-top: 4px;
`;

export { StyledBarometer, StyledFill, StyledValue, StyledFillAddornment, StyledGift, StyledStep, StyledTrack };
