import { Metadata } from 'next';
import { t } from '@lingui/macro';

import Receive from './Receive';

import { withLinguiPage } from '@/i18n/withLigui';
import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam } from '@/i18n/withLigui';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB Pay | ${t(i18n)`Receive`}`
  };
}

export default withLinguiPage(function Page() {
  return <Receive />;
});
