import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { t } from '@lingui/macro';

import Bridge from './(bridge)/bridge/page';

import { getI18nInstance } from '@/i18n/appRouterI18n';
import { PageLangParam } from '@/i18n/withLigui';
import { RoutesPath } from '@/constants';

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

export default function Page(props: Props) {
  const refCode = props.searchParams?.refCode;

  if (refCode) {
    redirect(`/${props.params.lang}${RoutesPath.SIGN_UP}?refCode=${refCode}`);
  }

  return <Bridge {...props} />;
}
