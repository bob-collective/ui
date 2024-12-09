import { t } from '@lingui/macro';
import { Metadata } from 'next';

import { Bridge } from './Bridge';

import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam, withLinguiPage } from '@/i18n/withLigui';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB | ${t(i18n)`Bridge`}`
  };
}

export default withLinguiPage(Bridge);
