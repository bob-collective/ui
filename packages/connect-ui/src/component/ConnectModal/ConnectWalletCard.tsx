import { ArrowRight, CardProps, Flex, P } from '@gobob/ui';
import { ReactNode } from 'react';

import { StyledConnectWalletCard } from './ConnectModal.style';

type Props = { label: ReactNode };

type InheritAttrs = Omit<CardProps, keyof Props | 'children'>;

type ConnectWalletCardProps = Props & InheritAttrs;

// FIXME: Card when disabled
const ConnectWalletCard = ({ label, isDisabled, ...props }: ConnectWalletCardProps) => {
  return (
    <StyledConnectWalletCard
      isHoverable
      isPressable
      $isDisabled={isDisabled}
      background='grey-800'
      direction='row'
      isDisabled={isDisabled}
      justifyContent='space-between'
      paddingX='xl'
      paddingY='2xl'
      rounded='md'
      {...props}
    >
      {/* Added Flex with padding just to match height of related component */}
      <Flex paddingY='xxs'>
        <P size='s' weight='medium'>
          {label}
        </P>
      </Flex>
      <ArrowRight size='s' />
    </StyledConnectWalletCard>
  );
};

export { ConnectWalletCard };
