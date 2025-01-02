import { t } from '@lingui/macro';
import { Metadata } from 'next';

import { Strategy } from './Strategy';

import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam, withLinguiPage } from '@/i18n/withLigui';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB | ${t(i18n)`Stake`}`
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withLinguiPage(Strategy as any);
