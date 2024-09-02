import styled from 'styled-components';

const StyledUpdateMark = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ theme }) => theme.spacing('md')};
  height: ${({ theme }) => theme.spacing('md')};
  border-radius: ${({ theme }) => theme.rounded('full')};
  background-color: ${({ theme }) => theme.color('red-500')};
`;

export { StyledUpdateMark };
