import { Metadata } from 'next';

import { Geoblock } from './Geoblock';

import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Geoblock'
};

export default withLinguiPage(Geoblock);
