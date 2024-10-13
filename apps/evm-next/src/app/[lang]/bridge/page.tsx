import { Metadata } from 'next';

import { Bridge } from './Bridge';

import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Bridge'
};

export default withLinguiPage(Bridge);
