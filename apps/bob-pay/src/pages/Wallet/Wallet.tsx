import { Main } from '@gobob/ui';

import { StyledFlex } from './Wallet.style';
import { Hero, TransactionList } from './components';

const Wallet = () => (
  <Main maxWidth='md' padding='md'>
    <StyledFlex direction='column'>
      <Hero />
      <TransactionList />
    </StyledFlex>
  </Main>
);

export { Wallet };
