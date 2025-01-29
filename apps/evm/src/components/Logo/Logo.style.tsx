import Link from 'next/link';
import styled from 'styled-components';

const StyledLogo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('md')};
  text-decoration: none;
`;

export { StyledLogo };
