import { Metadata } from 'next';

import { Apps } from './Apps';

import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Apps'
};

export default withLinguiPage(Apps);
