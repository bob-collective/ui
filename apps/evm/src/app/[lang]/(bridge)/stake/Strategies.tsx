'use client';

import { Layout } from '../components';

import { StrategiesTable } from './components';

import { PageLangParam } from '@/i18n/withLigui';

type Props = PageLangParam & {
  searchParams?: { receive: string };
};

function Strategies({ searchParams }: Props) {
  return (
    <Layout>
      <StrategiesTable searchParams={searchParams} />
    </Layout>
  );
}

export { Strategies };
