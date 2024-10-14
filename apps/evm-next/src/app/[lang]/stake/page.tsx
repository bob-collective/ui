import { Metadata } from 'next';

import { Stake } from './Stake';

import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Stake'
};

export default withLinguiPage(Stake);
