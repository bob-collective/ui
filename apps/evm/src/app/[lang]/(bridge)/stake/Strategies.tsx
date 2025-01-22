'use client';

import { BannerCarousel } from '../components/BannerCarousel';

import { StrategiesTable } from './components';

import { Main } from '@/components';
import { PageLangParam } from '@/i18n/withLigui';

type Props = PageLangParam & {
  searchParams?: { receive: string };
};

function Strategies({ searchParams }: Props) {
  return (
    <Main maxWidth='5xl' padding='md'>
      <BannerCarousel />
      <StrategiesTable searchParams={searchParams} />
    </Main>
  );
}

export { Strategies };
