'use client';

import { ConnectProvider } from '@gobob/connect-ui';
import { usePrices, useQuery } from '@gobob/react-query';
import { BOBUIProvider, Button, CSSReset, Modal, ModalBody, ModalFooter, ModalHeader, P, toast } from '@gobob/ui';
import { useAccount, useChainId, useConfig, useReconnect, useSwitchChain, watchAccount } from '@gobob/wagmi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Chain } from 'viem';

import { Header, Layout, Sidebar } from '@/components';
import { isClient, isValidChain, L1_CHAIN, RoutesPath } from '@/constants';
import { useBalances, useGetUser, useLogin, useLogout, useTokens } from '@/hooks';
import { StyledComponentsRegistry } from '@/lib/styled-components';
import { apiClient } from '@/utils';

const AuthCheck = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { switchChainAsync } = useSwitchChain();
  const router = useRouter();

  const config = useConfig();

  // We don't want to disconnect users if they switch account on the wallet or the bridge
  const shouldDisconnect = pathname === RoutesPath.HOME || pathname === RoutesPath.FUSION;

  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useGetUser();
  const { mutate: login, isPending: isLoggingIn } = useLogin({
    onSuccess: async () => {
      await refetchUser();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const { logout } = useLogout();
  const watchAccountRef = useRef<() => void>();

  useEffect(() => {
    const refCode = searchParams?.get('refCode');

    if ((pathname === RoutesPath.HOME || pathname === RoutesPath.FUSION) && refCode) {
      router.push(`${RoutesPath.SIGN_UP}?refCode=${refCode}`);
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
      pathname === RoutesPath.FUSION
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
  const pathname = usePathname();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    if (isClient) window?.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export function NestedProviders({ children }: PropsWithChildren) {
  const router = useRouter();
  const chainId = useChainId();

  // Called here to make sure data exists
  usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });
  useBalances(chainId);
  useTokens(chainId);

  const { reconnect } = useReconnect();

  useEffect(() => {
    reconnect();
  }, [reconnect]);

  return (
    <StyledComponentsRegistry>
      <BOBUIProvider navigate={router.push}>
        <ConnectProvider type='both'>
          <CSSReset />
          <ScrollToTop />
          <AuthCheck />
          <Layout>
            <Sidebar />
            <Header />
            {children}
          </Layout>
        </ConnectProvider>
      </BOBUIProvider>
    </StyledComponentsRegistry>
  );
}
