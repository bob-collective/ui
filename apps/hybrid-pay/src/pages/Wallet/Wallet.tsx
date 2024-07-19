import { Main } from '../../components';

import { StyledFlex } from './Wallet.style';
import { Hero, TransactionList } from './components';

const Wallet = () => (
  <Main maxWidth='5xl' padding='md'>
    <StyledFlex direction='column'>
      <Hero />
      <TransactionList />
    </StyledFlex>
  </Main>
);

export { Wallet };
