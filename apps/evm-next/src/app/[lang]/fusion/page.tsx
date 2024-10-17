import { Metadata } from 'next';
import { t } from '@lingui/macro';
import { redirect } from 'next/navigation';

import { Fusion } from './Fusion';

import { withLinguiPage } from '@/i18n/withLigui';
import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam } from '@/i18n/withLigui';
import { RoutesPath } from '@/constants';

export function generateMetadata({ params }: PageLangParam): Metadata {
  const i18n = getI18nInstance(params.lang);

  return {
    title: `BOB | ${t(i18n)`Fusion`}`
  };
}

interface Props {
  searchParams?: { refCode: string };
  params: { lang: string };
}

export default withLinguiPage(function Page({ searchParams, params }: Props) {
  const refCode = searchParams?.refCode;

  if (refCode) {
    redirect(`/${params.lang}${RoutesPath.SIGN_UP}?refCode=${refCode}`);
  }

  return <Fusion />;
});
