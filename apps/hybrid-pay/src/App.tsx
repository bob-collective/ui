import { useReconnect } from '@gobob/wagmi';
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { Header, Layout, Main, Sidebar } from './components';
import { RoutesPath } from './constants';

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Home = lazy(() => import('./pages/Home'));
const Custom404 = lazy(() => import('./pages/404'));

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

  useEffect(() => {
    reconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Sidebar />
        <Header />
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route element={<Home />} path={RoutesPath.HOME} />
            <Route element={<Custom404 />} path='*' />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
