import { t } from '@lingui/macro';
import { Metadata } from 'next';

import { strategiesInfo } from '../constants';

import { Strategy } from './Strategy';

import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam, withLinguiPage } from '@/i18n/withLigui';

type PageProps = PageLangParam & { params: { slug: string } };

export function generateMetadata({ params }: PageProps): Metadata {
  const i18n = getI18nInstance(params.lang);

  const strategyInfo = strategiesInfo[params.slug];

  if (strategyInfo) {
    return {
      title: `BOB | ${strategyInfo.name}`
    };
  }

  return {
    title: `BOB | ${t(i18n)`Stake`}`
  };
}

export default withLinguiPage<PageProps>(Strategy);
