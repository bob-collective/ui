import { Metadata } from 'next';

import { SignUp } from './SignUp';

import { withLinguiPage } from '@/i18n/withLigui';

export const metadata: Metadata = {
  title: 'BOB | Sign-Up'
};

export default withLinguiPage(SignUp);
