import { DynamicWidget, useDynamicContext, useDynamicEvents } from '@dynamic-labs/sdk-react-core';
import { ArrowLeft, Flex, FlexProps, Span } from '@gobob/ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { Logo } from '../Logo';
import { RoutesPath } from '../../constants';

import { StyledBackButton, StyledHeader, StyledLogoWrapper } from './Layout.style';

type Props = { isTestnet?: boolean; isFusion?: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type HeaderProps = Props & InheritAttrs;

const Header = ({ ...props }: HeaderProps): JSX.Element => {
  const { isAuthenticated } = useDynamicContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useDynamicEvents('logout', async () => {
    navigate(RoutesPath.HOME);
  });

  return (
    <StyledHeader alignItems='center' elementType='header' justifyContent='space-between' {...props}>
      <StyledLogoWrapper alignItems='center' gap='md'>
        {pathname === RoutesPath.HOME || !isAuthenticated ? (
          <Logo to={RoutesPath.HOME} />
        ) : (
          <Flex alignItems='center'>
            <StyledBackButton onPress={() => navigate(RoutesPath.HOME)}>
              <ArrowLeft size='s' strokeWidth={2} />
              <Span size='lg' weight='bold'>
                {pathname === RoutesPath.SEND ? 'Send' : 'Receive'}
              </Span>
            </StyledBackButton>
          </Flex>
        )}
      </StyledLogoWrapper>
      {isAuthenticated && <DynamicWidget />}
    </StyledHeader>
  );
};

export { Header };
