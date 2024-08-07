import { Span } from '@gobob/ui';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

type StyledNavLinkProps = {
  $isActive?: boolean;
};

const StyledNativeNavLink = styled(NavLink)<StyledNavLinkProps>`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StyledNavLink = styled(Span)<StyledNavLinkProps>`
  ${({ theme }) => theme.transition('common', 'normal')}

  &:hover {
    opacity: 0.8;
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;
  font: inherit;
  color: inherit;
`;

export { StyledNativeNavLink, StyledNavLink, StyledAnchor };
