import { Radio } from '@gobob/ui';
import styled from 'styled-components';

type StyledRadioProps = {
  $isSelected: boolean;
};

const StyledRadio = styled(Radio)<StyledRadioProps>`
  border: ${({ theme, $isSelected }) =>
    `1px solid ${$isSelected ? theme.color('primary-500') : theme.color('grey-400')}`};
  border-radius: ${({ theme }) => theme.rounded('md')};
  background-color: ${({ theme }) => theme.color('grey-800')};
  padding: ${({ theme }) => `${theme.spacing('lg')} ${theme.spacing('lg')}`};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing('lg')};

  &:first-of-type {
    margin-right: ${({ theme }) => theme.spacing('xl')};
  }

  &:last-of-type {
    margin-right: 0;
  }
`;

export { StyledRadio };
