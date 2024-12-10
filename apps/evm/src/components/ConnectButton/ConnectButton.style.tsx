import styled from 'styled-components';

const StyledContentWrapper = styled.div`
  background: ${({ theme }) => theme.color('grey-400')};
`;

const StyledMobileContentWrapper = styled(StyledContentWrapper)`
  border-top-right-radius: ${({ theme }) => theme.rounded('lg')};
  border-top-left-radius: ${({ theme }) => theme.rounded('lg')};
  overflow-y: auto;
  padding: 1rem;
  flex: 1 1 0%;
`;

export { StyledContentWrapper, StyledMobileContentWrapper };
