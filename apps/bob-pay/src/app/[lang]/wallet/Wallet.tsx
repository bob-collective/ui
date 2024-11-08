'use client';

import { Flex } from '@gobob/ui';

import { Hero, TransactionList } from './components';

import { Main } from '@/components';
import { withAuth } from '@/utils/with-auth';

const Wallet = () => (
  <Main maxWidth='md' padding='md'>
    <Flex direction='column' style={{ width: '100%' }}>
      <Hero />
      <TransactionList />
    </Flex>
  </Main>
);

export default withAuth(Wallet);
