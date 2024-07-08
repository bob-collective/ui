import { Main } from '../../components';
import { CHAIN } from '../../constants';
import { useTokens } from '../../hooks';

import { TransferForm } from './components';
import { StyledCard, StyledFlex } from './Home.style';

const Home = () => {
  const { data: tokens } = useTokens(CHAIN);

  if (!tokens?.length) return;

  return (
    <Main maxWidth='5xl' padding='md'>
      <StyledFlex alignItems='flex-start' direction={{ base: 'column', md: 'row' }} gap='2xl' marginTop='xl'>
        <StyledCard>
          <TransferForm />
        </StyledCard>
      </StyledFlex>
    </Main>
  );
};

export { Home };
