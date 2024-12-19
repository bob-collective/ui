import { Metadata } from 'next';
import { t } from '@lingui/macro';

import { StakeStrategy } from './StakeStrategy';

import { withLinguiPage } from '@/i18n/withLigui';
import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam } from '@/i18n/withLigui';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB | ${t(i18n)`Stake`}`
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withLinguiPage(StakeStrategy as any);
