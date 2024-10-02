import { Flex, Radio } from '@gobob/ui';
import styled from 'styled-components';

const StyledRadio = styled(Radio)`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.color('grey-400')};
  border-radius: ${({ theme }) => theme.rounded('md')};
  background-color: ${({ theme }) => theme.color('grey-600')};
  padding: ${({ theme }) => `${theme.spacing('lg')} ${theme.spacing('lg')}`};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing('lg')};

  &[data-selected] {
    /* border-color: ${({ theme }) => theme.color('primary-500')}; */
  }

  &[data-hover] {
    border-color: ${({ theme }) => theme.color('grey-300')};
  }

  &[data-focus] {
    border-color: ${({ theme }) => theme.color('light')};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.color('light')};
  }

  &:first-of-type {
    margin-right: ${({ theme }) => theme.spacing('xl')};
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

const StyledChainsGrid = styled(Flex)`
  display: grid;
  grid-template-columns: 1fr ${({ theme }) => theme.spacing('xl')} 1fr;
`;

export { StyledRadio, StyledChainsGrid };
