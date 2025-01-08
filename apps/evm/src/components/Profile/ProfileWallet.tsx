'use client';

import { Button, Card, ChevronRight, Flex, LinkSlash, Skeleton, Span, Spinner, Tooltip } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { ReactNode, useState } from 'react';
import { Currency, CurrencyAmount } from '@gobob/currency';

import { CopyAddress } from '../CopyAddress';

import { StyledWalletCard } from './ProfileDrawer.style';

type ProfileWalletProps = {
  onPressConnect: () => void;
  onUnlink?: (id: string) => void;
  avatar: ReactNode;
  balance?: CurrencyAmount<Currency>;
  walletAvatar?: ReactNode;
  address?: string;
  truncatedAddress?: string;
  connectLabel: ReactNode;
  walletId?: string;
  isRemovable?: boolean;
};

const ProfileWallet = ({
  onPressConnect,
  onUnlink,
  avatar,
  balance,
  walletAvatar,
  address,
  truncatedAddress,
  connectLabel,
  walletId,
  isRemovable
}: ProfileWalletProps): JSX.Element | null => {
  const [prevWallet, setPrevWallet] = useState<string | undefined>(walletId);
  const [isDisconnecting, setDisconnecting] = useState(false);

  if (walletId !== prevWallet) {
    setPrevWallet(walletId);
    setDisconnecting(false);
  }

  if (!walletId || !address || !truncatedAddress) {
    return (
      <StyledWalletCard
        isHoverable
        isPressable
        alignItems='center'
        background='grey-600'
        direction='row'
        gap='md'
        justifyContent='space-between'
        padding='md'
        onPress={onPressConnect}
      >
        <Flex alignItems='center' gap='md'>
          {avatar}
          <Span size='s' weight='semibold'>
            {connectLabel}
          </Span>
        </Flex>
        <ChevronRight color='grey-50' />
      </StyledWalletCard>
    );
  }

  const handleUnlink = () => {
    onUnlink?.(walletId);
    setDisconnecting(true);
  };

  return (
    <Card
      key={walletId}
      alignItems='center'
      background='grey-600'
      direction='row'
      gap='md'
      justifyContent='space-between'
      padding='md'
    >
      <Flex alignItems='center' gap='md'>
        {avatar}
        <Flex direction='column'>
          {balance ? (
            <Span size='s' weight='semibold'>
              {balance.toSignificant()} {balance.currency.symbol}
            </Span>
          ) : (
            <Skeleton />
          )}
          <Flex alignItems='center' gap='s'>
            {walletAvatar}
            <CopyAddress
              address={address}
              color='grey-50'
              size='xs'
              truncatedAddress={truncatedAddress}
              weight='semibold'
            />
          </Flex>
        </Flex>
      </Flex>
      {isRemovable && onUnlink && (
        <Tooltip label={<Trans>Unlink wallet</Trans>}>
          <Button isIconOnly size='s' variant='ghost' onPress={handleUnlink}>
            {isDisconnecting ? <Spinner size='s' /> : <LinkSlash color='grey-50' size='s' />}
          </Button>
        </Tooltip>
      )}
    </Card>
  );
};

export { ProfileWallet };
export type { ProfileWalletProps };
