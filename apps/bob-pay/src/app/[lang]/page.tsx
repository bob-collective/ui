import { t } from '@lingui/macro';
import { Metadata } from 'next';

import Wallet from './wallet/page';

import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam } from '@/i18n/withLigui';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB | ${t(i18n)`Bridge`}`
  };
}

interface Props {
  searchParams?: { refCode: string };
  params: { lang: string };
}

export default async function Page(props: Props) {
  return <Wallet {...props} />;
}
