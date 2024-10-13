import { Metadata } from 'next';

import { Fusion } from './Fusion';

import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Fusion'
};

export default withLinguiPage(Fusion);
