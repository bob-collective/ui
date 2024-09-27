import { usePrices, useQuery } from '@gobob/react-query';
import { useAccount, useChainId, useConfig, useReconnect, useSwitchChain, watchAccount } from '@gobob/wagmi';
import { ModalBody, ModalHeader, Modal, P, ModalFooter, Button, toast, BOBUIProvider } from '@gobob/ui';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Chain } from 'viem';
import { ConnectProvider } from '@gobob/connect-ui';

import { Header, Layout, Main, Sidebar } from './components';
import { L1_CHAIN, RoutesPath, isValidChain } from './constants';
import { FeatureFlags, useFeatureFlag, useGetUser, useLogin, useLogout, useTokens } from './hooks';
import { useBalances } from './hooks/useBalances';
import { apiClient } from './utils';

const AuthCheck = () => {
  const [isOpen, setOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams(new URLSearchParams());
  const { switchChainAsync } = useSwitchChain();
  const navigate = useNavigate();

  const config = useConfig();

  // We don't want to disconnect users if they switch account on the wallet or the bridge
  const shouldDisconnect = location.pathname === RoutesPath.HOME || location.pathname === RoutesPath.FUSION;

  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useGetUser();
  const { mutate: login, isPending: isLoggingIn } = useLogin({
    onSuccess: async () => {
      await refetchUser();
    },
    onError: (e: any) => {
      if (e.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error(e.message || 'Something went wrong. Please try again later.');
      }
    }
  });

  const { address, chain } = useAccount();

  const { data: isFusionUser, isLoading: isCheckingFusionUser } = useQuery({
    enabled: Boolean(address),
    queryKey: ['check-user', address],
    queryFn: async () => {
      return !!(await apiClient.isFusionUser(address!));
    }
  });

  const { logout } = useLogout({
    onSuccess: () => {
      refetchUser();
    }
  });
  const watchAccountRef = useRef<() => void>();

  useEffect(() => {
    const refCode = searchParams.get('refCode');

    if ((location.pathname === RoutesPath.HOME || location.pathname === RoutesPath.FUSION) && refCode) {
      navigate(`${RoutesPath.SIGN_UP}?refCode=${refCode}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    watchAccountRef.current = watchAccount(config, {
      onChange: (account) => {
        if (
          shouldDisconnect &&
          user &&
          account.address &&
          address &&
          (account.address !== user.evm_address || account.address !== address)
        ) {
          logout({});
          setOpen(true);
        }
      }
    });

    // Cleanup by calling unwatch to unsubscribe from the account change event
    return () => watchAccountRef.current?.();
  }, [user, address, shouldDisconnect, config, logout]);

  useEffect(() => {
    const checkLogin = async (address: string, chain: Chain | undefined) => {
      if (!chain || !isValidChain(chain.id)) {
        const chain = await switchChainAsync({ chainId: L1_CHAIN });

        if (!chain) {
          return toast.error('Something went wrong. Please try connecting your wallet again.');
        }
      }

      return login(address);
    };

    if (
      address &&
      !user &&
      !isLoadingUser &&
      !isLoggingIn &&
      !isCheckingFusionUser &&
      isFusionUser &&
      (location.pathname === RoutesPath.FUSION || location.pathname === RoutesPath.APPS)
    ) {
      checkLogin(address, chain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, user, isFusionUser]);

  useEffect(() => {
    if (!address && user) {
      logout({});
    }
  }, [address, logout, user]);

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <ModalHeader>Disconnected</ModalHeader>
      <ModalBody gap='2xl'>
        <P align='center' color='primary-500' size='lg' weight='bold'>
          Your funds are safe!
        </P>
        <P size='s'>
          You have switched your account mid session. Simply switch back the original account and login to have access
          to your funds again.
        </P>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onPress={() => setOpen(false)}>
          Got it!
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const { pathname } = useLocation();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const SignUp = lazy(() => import('./pages/SignUp'));
const Apps = lazy(() => import('./pages/Apps'));
const Fusion = lazy(() => import('./pages/Fusion'));
const Bridge = lazy(() => import('./pages/Bridge'));
const Stake = lazy(() => import('./pages/Stake'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Geoblock = lazy(() => import('./pages/Geoblock'));
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
  const chainId = useChainId();
  const navigate = useNavigate();

  // Called here to make sure data exists
  usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  useBalances(chainId);
  useTokens(chainId);

  const isWalletEnabled = useFeatureFlag(FeatureFlags.WALLET);

  const { reconnect } = useReconnect();

  useEffect(() => {
    reconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BOBUIProvider navigate={navigate}>
      <ConnectProvider type='both'>
        <ScrollToTop />
        <AuthCheck />
        <Layout>
          <Sidebar />
          <Header />
          <Suspense fallback={<Fallback />}>
            <Routes>
              <Route element={<Bridge />} path={RoutesPath.HOME} />
              <Route element={<SignUp />} path={RoutesPath.SIGN_UP} />
              <Route element={<Fusion />} path={RoutesPath.FUSION} />
              <Route element={<Apps />} path={RoutesPath.APPS} />
              <Route element={<Bridge />} path={RoutesPath.BRIDGE} />
              {isWalletEnabled && <Route element={<Wallet />} path={RoutesPath.WALLET} />}
              <Route element={<Stake />} path={RoutesPath.STAKE} />
              <Route element={<Geoblock />} path={RoutesPath.GEOBLOCK} />
              <Route element={<Custom404 />} path='*' />
            </Routes>
          </Suspense>
        </Layout>
      </ConnectProvider>
    </BOBUIProvider>
  );
}

export default App;
