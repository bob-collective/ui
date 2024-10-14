import { Metadata } from 'next';

import { Wallet } from './Wallet';

import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Walelt'
};

export default withLinguiPage(function Page() {
  const isWalletEnabled = useFeatureFlag(FeatureFlags.WALLET);

  if (!isWalletEnabled) return null;

  return <Wallet />;
});
