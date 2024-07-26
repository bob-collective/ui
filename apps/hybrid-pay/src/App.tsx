import { useAccount, useReconnect } from '@gobob/wagmi';
import { ReactNode, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DynamicEmbeddedWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePrices } from '@gobob/react-query';
import { Card, Flex, P, TextLink } from '@gobob/ui';

import { Header, Layout, Main } from './components';
import { CHAIN, RoutesPath } from './constants';
import { useTokens } from './hooks';
import { BalanceProvider } from './providers';

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Wallet = lazy(() => import('./pages/Wallet'));
const Send = lazy(() => import('./pages/Send'));
const Receive = lazy(() => import('./pages/Receive'));
const Custom404 = lazy(() => import('./pages/404'));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useDynamicContext();

  if (!isAuthenticated) {
    return (
      <Main maxWidth='md' padding='md'>
        <Flex alignItems='center' direction='column' gap='2xl' marginTop='xl' style={{ width: '100%' }}>
          <Card bordered={false} padding='none' style={{ width: '100%' }}>
            <DynamicEmbeddedWidget background='none' />
            <Flex justifyContent='center' paddingBottom='s'>
              <P
                align='center'
                size='xs'
                style={{
                  color: 'var(--dynamic-text-tertiary)',
                  fontFamily: 'var(--dynamic-font-family-primary)',
                  marginTop: '-0.5rem'
                }}
              >
                By logging in, you agree to our{' '}
                <TextLink
                  external
                  color='inherit'
                  href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
                  size='inherit'
                  style={{
                    fontFamily: 'inherit'
                  }}
                >
                  Terms and Conditions.
                </TextLink>
              </P>
            </Flex>
          </Card>
        </Flex>
      </Main>
    );
  }

  return children;
};

// using Main just so we can show the background wallpaper
const Fallback = () => {
  const { pathname } = useLocation();

  if (pathname === RoutesPath.HOME) return null;

  return (
    <Main>
      <div />
    </Main>
  );
};

// TODO: reset queries when logout
function App() {
  const { reconnect } = useReconnect();
  const { walletConnector } = useDynamicContext();
  const { chain } = useAccount();

  useEffect(() => {
    reconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  useTokens(CHAIN);

  useEffect(() => {
    const switchChain = () => {
      walletConnector!.switchNetwork({ networkChainId: CHAIN });
    };

    if (walletConnector && chain && CHAIN !== chain.id) {
      switchChain();
    }
  }, [chain, walletConnector]);

  return (
    <BalanceProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Header />
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                }
                path={RoutesPath.HOME}
              />
              <Route
                element={
                  <ProtectedRoute>
                    <Send />
                  </ProtectedRoute>
                }
                path={RoutesPath.SEND}
              />
              <Route
                element={
                  <ProtectedRoute>
                    <Receive />
                  </ProtectedRoute>
                }
                path={RoutesPath.RECEIVE}
              />
              <Route element={<Custom404 />} path='*' />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </BalanceProvider>
  );
}

export default App;
