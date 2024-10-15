import { Metadata } from 'next';
import { t } from '@lingui/macro';

import { Wallet } from './Wallet';

import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { withLinguiPage } from '@/i18n/withLigui';
import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam } from '@/i18n/withLigui';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB | ${t(i18n)`Wallet`}`
  };
}

export default withLinguiPage(function Page() {
  const isWalletEnabled = useFeatureFlag(FeatureFlags.WALLET);

  if (!isWalletEnabled) return null;

  return <Wallet />;
});
