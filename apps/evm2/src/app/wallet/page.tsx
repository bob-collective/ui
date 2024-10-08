import { Wallet } from './Wallet';

import { FeatureFlags, useFeatureFlag } from '@/hooks';

export default function Page() {
  const isWalletEnabled = useFeatureFlag(FeatureFlags.WALLET);

  if (!isWalletEnabled) return null;

  return <Wallet />;
}
