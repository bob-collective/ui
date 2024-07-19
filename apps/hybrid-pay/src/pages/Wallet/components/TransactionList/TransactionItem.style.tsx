import styled from 'styled-components';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing('md')};
`;

export { StyledGrid };
