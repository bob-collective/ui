import { Metadata } from 'next';

import { Wallet } from './Wallet';

import { FeatureFlags, useFeatureFlag } from '@/hooks';

export const metadata: Metadata = {
  title: 'BOB | Walelt'
};

export default function Page() {
  const isWalletEnabled = useFeatureFlag(FeatureFlags.WALLET);

  if (!isWalletEnabled) return null;

  return <Wallet />;
}
