import { DynamicWidget, useDynamicContext, useDynamicEvents } from '@dynamic-labs/sdk-react-core';
import { ArrowLeft, Flex, FlexProps, Span, Header as HeaderLib } from '@gobob/ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { Logo } from '../Logo';
import { RoutesPath } from '../../constants';

import { StyledBackButton } from './Header.style';

type Props = {};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type HeaderProps = Props & InheritAttrs;

const Header = ({ ...props }: HeaderProps): JSX.Element => {
  const { isAuthenticated } = useDynamicContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useDynamicEvents('logout', async () => {
    navigate(RoutesPath.HOME);
  });

  const logo =
    pathname === RoutesPath.HOME || !isAuthenticated ? (
      <Logo to={RoutesPath.HOME} />
    ) : (
      <Flex alignItems='center'>
        <StyledBackButton onPress={() => navigate(RoutesPath.HOME)}>
          <ArrowLeft color='light' size='s' strokeWidth={2} />
          <Span size='lg' weight='bold'>
            {pathname === RoutesPath.SEND ? 'Send' : 'Receive'}
          </Span>
        </StyledBackButton>
      </Flex>
    );

  return (
    <HeaderLib logo={logo} logoHref={RoutesPath.HOME} {...props}>
      {isAuthenticated && <DynamicWidget />}
    </HeaderLib>
  );
};

export { Header };
