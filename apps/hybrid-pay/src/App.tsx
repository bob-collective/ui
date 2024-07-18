import { useAccount, useReconnect } from '@gobob/wagmi';
import { ReactNode, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePrices } from '@gobob/react-query';

import { Header, Layout, Main } from './components';
import { CHAIN, RoutesPath } from './constants';
import { useBalances, useTokens } from './hooks';

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
const Recieve = lazy(() => import('./pages/Recieve'));
const Custom404 = lazy(() => import('./pages/404'));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useDynamicContext();

  if (!isAuthenticated) {
    return <Navigate replace to={RoutesPath.HOME} />;
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

function App() {
  const { reconnect } = useReconnect();
  const { walletConnector } = useDynamicContext();
  const { chain } = useAccount();

  useEffect(() => {
    reconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  useBalances(CHAIN);
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
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Header />
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route element={<Wallet />} path={RoutesPath.HOME} />
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
                  <Recieve />
                </ProtectedRoute>
              }
              path={RoutesPath.RECIEVE}
            />
            <Route element={<Custom404 />} path='*' />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
