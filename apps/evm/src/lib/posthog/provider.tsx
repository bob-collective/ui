'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';

import PageView from './PageView';

import { useIsContract } from '@/hooks';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { address: evmAddress, chainId } = useAccount();
  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress, chainId });
  const { address: btcAddress, connector: btcConnector } = useSatsAccount();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true // Enable pageleave capture
    });
  }, []);

  useEffect(() => {
    if (!btcAddress || !evmAddress) return;

    // only captures btc wallet event if evm is connected
    posthog.capture(PosthogEvents.CONNECT_BTC_WALLET, {
      $set: { btc_address: btcAddress, btc_wallet: btcConnector?.name }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btcAddress, btcConnector?.name]);

  useAccountEffect({
    onConnect: (data) => {
      posthog.identify(data.address, undefined, {
        evm_address: data.address,
        evm_wallet: data.connector.name,
        btc_address: btcAddress,
        btc_wallet: btcConnector?.name
      });

      posthog.capture(PosthogEvents.CONNECT_EVM_WALLET, {
        btc_address: btcAddress,
        btc_wallet: btcConnector?.name,
        $set_once: {
          initial_evm_wallet: data.connector.name,
          initial_btc_wallet: btcConnector?.name,
          is_smart_contract: isSmartAccount
        },
        $set: {
          evm_address: data.address,
          evm_wallet: data.connector.name,
          btc_address: btcAddress,
          btc_wallet: btcConnector?.name
        }
      });
    },
    onDisconnect: () => {
      posthog.reset();
    }
  });

  return (
    <PHProvider client={posthog}>
      <PageView />
      {children}
    </PHProvider>
  );
}
