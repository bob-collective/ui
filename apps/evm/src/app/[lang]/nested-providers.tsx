'use client';

import { usePrices } from '@gobob/react-query';
import { BOBUIProvider, Button, CSSReset, Modal, ModalBody, ModalFooter, ModalHeader, P } from '@gobob/ui';
import {
  useAccount,
  useAccountEffect,
  useChainId,
  useConfig,
  useReconnect,
  useSwitchChain,
  watchAccount
} from '@gobob/wagmi';
import { Trans } from '@lingui/macro';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, Suspense, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { Header, Layout, Sidebar } from '@/components';
import { ConnectProvider } from '@/connect-ui';
import { L2_CHAIN, LocalStorageKey, RoutesPath } from '@/constants';
import { useBalances, useGetUser, useLogout, useTokens } from '@/hooks';
import { StyledComponentsRegistry } from '@/lib/styled-components';

const AuthCheck = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();

  const config = useConfig();

  // We don't want to disconnect users if they switch account on the wallet or the bridge
  const shouldDisconnect =
    pathname === `/${params.lang}${RoutesPath.HOME}` || pathname === `/${params.lang}${RoutesPath.FUSION}`;

  const { data: user, refetch: refetchUser } = useGetUser();

  const { address } = useAccount();

  const { logout } = useLogout({
    onSuccess: () => {
      refetchUser();
    }
  });
  const watchAccountRef = useRef<() => void>();

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
    if (!address && user) {
      logout({});
    }
  }, [address, logout, user]);

  return (
    <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
      <ModalHeader>
        <Trans>Disconnected</Trans>
      </ModalHeader>
      <ModalBody gap='2xl'>
        <P align='center' color='primary-500' size='lg' weight='bold'>
          <Trans>Your funds are safe!</Trans>
        </P>
        <P size='s'>
          <Trans>
            You have switched your account mid session. Simply switch back the original account and login to have access
            to your funds again.
          </Trans>
        </P>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onPress={() => setOpen(false)}>
          <Trans>Got it!</Trans>
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
    window?.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Allows us to prompt the user to add our chain.
const usePromptSwitchChain = () => {
  const { switchChainAsync } = useSwitchChain();

  const [shouldPromptSwitchChain, setShouldPromptSwitchChain] = useLocalStorage<boolean | null>(
    LocalStorageKey.PROMPT_SWITCH_CHAIN,
    true
  );

  useAccountEffect({
    async onConnect() {
      if (shouldPromptSwitchChain) {
        try {
          await switchChainAsync({ chainId: L2_CHAIN });

          return setShouldPromptSwitchChain(false);
        } catch (e) {
          return setShouldPromptSwitchChain(null);
        }
      }
    },
    onDisconnect() {
      // try again to add chain after reject
      if (shouldPromptSwitchChain === null) {
        setShouldPromptSwitchChain(true);
      }
    }
  });
};

export function NestedProviders({ children }: PropsWithChildren) {
  const router = useRouter();
  const chainId = useChainId();

  // Called here to make sure data exists
  usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });
  useBalances(chainId);
  useTokens(chainId);

  usePromptSwitchChain();

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
          <Suspense>
            <AuthCheck />
          </Suspense>
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
