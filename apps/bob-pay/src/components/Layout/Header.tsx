import { DynamicWidget, useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { ArrowLeft, Flex, FlexProps, Span } from '@gobob/ui';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { StyledBackButton, StyledHeader, StyledLogoWrapper } from './Layout.style';
import { Logo } from './Logo';

import { RoutesPath } from '@/constants';

type Props = { isTestnet?: boolean; isFusion?: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type HeaderProps = Props & InheritAttrs;

const Header = ({ ...props }: HeaderProps): JSX.Element => {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded } = useDynamicContext();
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = !(pathname.endsWith(RoutesPath.SEND) || pathname.endsWith(RoutesPath.RECEIVE));

  return (
    <StyledHeader alignItems='center' elementType='header' justifyContent='space-between' {...props}>
      <StyledLogoWrapper alignItems='center' gap='md'>
        {isHomePage || (sdkHasLoaded && !isLoggedIn) ? (
          <Link href={RoutesPath.HOME}>
            <Logo />
          </Link>
        ) : (
          <Flex alignItems='center'>
            <StyledBackButton onPress={() => router.push(RoutesPath.HOME)}>
              <ArrowLeft color='light' size='s' strokeWidth={2} />
              <Span size='lg' weight='bold'>
                {pathname.endsWith(RoutesPath.SEND) ? 'Send' : 'Receive'}
              </Span>
            </StyledBackButton>
          </Flex>
        )}
      </StyledLogoWrapper>
      {isLoggedIn && <DynamicWidget />}
    </StyledHeader>
  );
};

export { Header };
