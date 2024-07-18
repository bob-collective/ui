import { DynamicEmbeddedWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';

import { Main } from '../../components';

import { StyledCard, StyledFlex } from './Wallet.style';
import { Hero } from './components';

const Wallet = () => {
  const { isAuthenticated } = useDynamicContext();

  if (!isAuthenticated) {
    return (
      <Main maxWidth='5xl' padding='md'>
        <StyledFlex alignItems='flex-start' gap='2xl' marginTop='xl'>
          <StyledCard bordered={false} padding='none'>
            <DynamicEmbeddedWidget background='none' />
          </StyledCard>
        </StyledFlex>
      </Main>
    );
  }

  return (
    <Main maxWidth='5xl' padding='md'>
      <StyledFlex>
        <Hero />
      </StyledFlex>
    </Main>
  );
};

export { Wallet };
