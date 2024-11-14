'use client';

import { usePrices } from '@gobob/hooks';
import { BOBUIProvider, Button, CSSReset, Modal, ModalBody, ModalFooter, ModalHeader, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { watchAccount } from '@wagmi/core';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, Suspense, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { isAddressEqual } from 'viem';
import { useAccount, useAccountEffect, useChainId, useConfig, useSwitchChain } from 'wagmi';

import { Header, Layout, Sidebar } from '@/components';
import { isClient, L2_CHAIN, LocalStorageKey } from '@/constants';
import { useBalances, useGetUser, useLogout, useTokens } from '@/hooks';
import { StyledComponentsRegistry } from '@/lib/styled-components';

const AuthCheck = () => {
  const [isOpen, setOpen] = useState(false);

  const config = useConfig();

  const { data: user } = useGetUser();

  const { address } = useAccount();

  const { logout } = useLogout();

  const watchAccountRef = useRef<() => void>();

  useEffect(() => {
    watchAccountRef.current = watchAccount(config, {
      onChange: (account) => {
        if (
          user &&
          account.address &&
          address &&
          (!isAddressEqual(account.address, user.evm_address) || !isAddressEqual(account.address, address))
        ) {
          logout({});
          setOpen(true);
        }
      }
    });

    // Cleanup by calling unwatch to unsubscribe from the account change event
    return () => watchAccountRef.current?.();
  }, [user, address, config, logout]);

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
    true,
    { initializeWithValue: isClient }
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
  usePrices();
  useBalances(chainId);
  useTokens(chainId);

  usePromptSwitchChain();

  return (
    <StyledComponentsRegistry>
      <BOBUIProvider navigate={router.push}>
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
      </BOBUIProvider>
    </StyledComponentsRegistry>
  );
}
