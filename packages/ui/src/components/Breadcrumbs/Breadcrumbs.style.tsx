import styled from 'styled-components';

import { Span } from '../Text';
import { Link } from '../Link';

type StyledBreadcrumbProps = {
  $isDisabled?: boolean;
};

const StyledNav = styled.nav``;

const StyledList = styled.ul`
  flex-wrap: nowrap;
  flex: 1 0;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
`;

const StyledListItem = styled.li`
  justify-content: flex-start;
  align-items: center;
  display: inline-flex;
  position: relative;
`;

const StyledSpanBreadcrumb = styled(Span)<StyledBreadcrumbProps>`
  padding: 0 ${({ theme }) => theme.spacing('s')};
  cursor: default;
`;

const StyledLinkBreadcrumb = styled(Link)<StyledBreadcrumbProps>`
  padding: 0 ${({ theme }) => theme.spacing('s')};
  text-decoration: none;
`;

export { StyledLinkBreadcrumb, StyledList, StyledListItem, StyledNav, StyledSpanBreadcrumb };
